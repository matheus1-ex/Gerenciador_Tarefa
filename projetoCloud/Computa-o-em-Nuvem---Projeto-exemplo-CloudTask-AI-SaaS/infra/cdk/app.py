"""Ponto de entrada do app AWS CDK — CloudTask AI SaaS (Aula 11)."""

from __future__ import annotations

import os

import aws_cdk as cdk

from stacks.storage_stack import StorageStack
from stacks.ecr_stack import EcrStack
from stacks.network_stack import NetworkStack
from stacks.events_stack import EventsStack
from stacks.observability_stack import ObservabilityStack
from stacks.database_stack import DatabaseStack
from stacks.compute_stack import ComputeStack

app = cdk.App()

# Usando o Synthesizer para rodar direto com as credenciais ativas do Learner Lab
synthesizer = cdk.CliCredentialsStackSynthesizer()

# ---------------------------------------------------------------------------
# ALTERAÇÃO AQUI: Fixando a sua conta e região do AWS Academy de forma definitiva
# ---------------------------------------------------------------------------
env = cdk.Environment(
    account="090402449254",  # O ID da sua conta AWS do laboratório
    region="us-east-1",      # A região padrão do Learner Lab
)

# Prefixo comum nos nomes das stacks
PREFIX = "CloudTask"

# Tags aplicadas a TODOS os recursos
common_tags = {
    "project": "cloudtask-ai-saas",
    "discipline": "computacao-em-nuvem-uninter",
    "managed-by": "cdk",
}

# Instanciando as Stacks com o ambiente fixado
storage = StorageStack(app, f"{PREFIX}Storage", env=env, tags=common_tags, synthesizer=synthesizer)
ecr = EcrStack(app, f"{PREFIX}Ecr", env=env, tags=common_tags, synthesizer=synthesizer)
network = NetworkStack(app, f"{PREFIX}Network", env=env, tags=common_tags, synthesizer=synthesizer)
events = EventsStack(app, f"{PREFIX}Events", env=env, tags=common_tags, synthesizer=synthesizer)

observability = ObservabilityStack(
    app,
    f"{PREFIX}Observability",
    env=env,
    tags=common_tags,
    synthesizer=synthesizer,
    events_table=events.table,
)

database = DatabaseStack(
    app,
    f"{PREFIX}Database",
    env=env,
    tags=common_tags,
    synthesizer=synthesizer,
    vpc=network.vpc,
)

compute = ComputeStack(
    app,
    f"{PREFIX}Compute",
    env=env,
    tags=common_tags,
    synthesizer=synthesizer,
    vpc=network.vpc,
    db=database.instance,
    db_secret_name=database.db_secret_name,
)

app.synth()