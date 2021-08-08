from typing import Any, Dict, List

from pydantic.main import BaseModel


class DICOMObjectModel(BaseModel):
    patient_id: str
    study_id: str
    series_id: str
    info: Dict[str, Any] = {}


class DICOMLabelModel(DICOMObjectModel):
    tag: str


class DICOMImageModel(BaseModel):
    info: Dict[str, Any] = {}
    related_labels_keys: List[str] = []


class DICOMWebDatastoreModel(BaseModel):
    url: str
    description: str
    objects: Dict[str, DICOMObjectModel] = {}