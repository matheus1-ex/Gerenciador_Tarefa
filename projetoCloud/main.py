import os
import boto3
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db
import models, database

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="CloudTask SaaS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dados que vêm do Frontend (Cadastro)
class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

# Dados que vêm do Frontend (Login)
class LoginRequest(BaseModel):
    email: str
    senha: str

class TarefaCreate(BaseModel):
    titulo: str
    descricao: str
    data_tarefa: str
    prioridade: str

class TarefaResponse(TarefaCreate):
    id: int
    status: str
    class Config:
        from_attributes = True

def achar_html(nome_arquivo):
    caminhos_possiveis = [
        nome_arquivo,                               
        f"/var/www/html/{nome_arquivo}",            
        f"/home/ec2-user/{nome_arquivo}"           
    ]
    for caminho in caminhos_possiveis:
        if os.path.exists(caminho):
            return caminho
    return None

@app.get("/")
def home():
    return {"mensagem": "API CloudTask rodando e conectada ao banco de dados!"}

# Rota de Cadastro de Usuário
@app.post("/cadastrar/")
def cadastrar_usuario(usuario: UsuarioCreate, db: Session = Depends(database.get_db)):
    novo_usuario = models.UsuarioTable(
        nome=usuario.nome,
        email=usuario.email,
        senha=usuario.senha
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return {"mensagem": "Usuário cadastrado com sucesso!"}

# Rota de Login
@app.post("/login/")
def login(dados: LoginRequest, db: Session = Depends(database.get_db)):
    usuario = db.query(models.UsuarioTable).filter(models.UsuarioTable.email == dados.email).first()
    
    if not usuario or usuario.senha != dados.senha:
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    return {"mensagem": "Login realizado com sucesso!", "nome": usuario.nome}

@app.post("/tarefas/", response_model=TarefaResponse)
def criar_tarefa(tarefa: TarefaCreate, db: Session = Depends(database.get_db)):
    nova_tarefa = models.TarefaTable(
        titulo=tarefa.titulo, 
        descricao=tarefa.descricao, 
        data_tarefa=tarefa.data_tarefa, 
        prioridade=tarefa.prioridade
    )
    db.add(nova_tarefa)
    db.commit()
    db.refresh(nova_tarefa)
    return nova_tarefa

@app.get("/tarefas/", response_model=List[TarefaResponse])
def listar_tarefas(db: Session = Depends(database.get_db)):
    return db.query(models.TarefaTable).all()

@app.delete("/tarefas/{tarefa_id}")
def deletar_tarefa(tarefa_id: int, db: Session = Depends(database.get_db)):
    tarefa = db.query(models.TarefaTable).filter(models.TarefaTable.id == tarefa_id).first()
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    db.delete(tarefa)
    db.commit()
    return {"mensagem": f"Tarefa {tarefa_id} deletada com sucesso!"}

BUCKET_NAME = os.getenv("AWS_BUCKET_NAME", "balse-01-teste")  # Nome do bucket S3

s3_client = boto3.client("s3")

@app.post("/tarefas/{tarefa_id}/upload")
async def upload_arquivo_tarefa(tarefa_id: int, file: UploadFile = File(...)):
    try:
        s3_key = f"tarefas/{tarefa_id}/{file.filename}"
        
        s3_client.upload_fileobj(
            file.file,
            BUCKET_NAME,
            s3_key
        )
        
        file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
        
        return {
            "message": "Arquivo enviado com sucesso para a AWS S3!",
            "nome_arquivo": file.filename,
            "url_na_nuvem": file_url
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao enviar para o S3: {str(e)}")