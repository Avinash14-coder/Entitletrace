import os
from pathlib import Path

# Project root contains 'config', 'data', 'backend', 'frontend'
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent

def get_path(rel_path: str) -> str:
    """
    Resolves a relative path against the project root if it doesn't exist directly.
    """
    if os.path.isabs(rel_path) and os.path.exists(rel_path):
        return rel_path
    if os.path.exists(rel_path):
        return os.path.abspath(rel_path)
    candidate = os.path.join(PROJECT_ROOT, rel_path)
    return os.path.abspath(candidate)
