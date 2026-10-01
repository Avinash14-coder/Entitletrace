import pytest
from backend.app.nlp.retrieval import get_retriever

def test_retriever_load_and_search():
    retriever = get_retriever()
    results = retriever.retrieve("income limit annual certificate", scheme_id="SCH_POST_MATRIC_SC", top_k=3)
    assert len(results) > 0
    assert results[0]["scheme_id"] == "SCH_POST_MATRIC_SC"
    assert "income" in results[0]["text"].lower() or "2,50,000" in results[0]["text"]

def test_retriever_global():
    retriever = get_retriever()
    results = retriever.retrieve("ladki bahin maharashtra women", scheme_id=None, top_k=3)
    assert len(results) > 0
    assert any("MAJHI_LADKI_BAHIN" in r["scheme_id"] for r in results)
