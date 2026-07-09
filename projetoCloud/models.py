from sqlalchemy import Column, Integer, String
import database

class UsuarioTable(database.Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String)
    senha = Column(String)

class TarefaTable(database.Base):
    __tablename__ = "tarefas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    descricao = Column(String)
    data_tarefa = Column(String)
    prioridade = Column(String)
    status = Column(String, default="pendente")