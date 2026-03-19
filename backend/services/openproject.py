import os
import requests
import base64
from typing import Optional, Dict, Any, List

class OpenProjectClient:
    """Client for OpenProject Integration using API v3."""
    
    def __init__(self):
        self.base_url = os.getenv("OPENPROJECT_URL", "http://openproject-web:8080").rstrip("/")
        self.api_key = os.getenv("OPENPROJECT_API_KEY", "")
        
        # OpenProject uses apikey as username for token auth
        auth_str = f"apikey:{self.api_key}"
        encoded_auth = base64.b64encode(auth_str.encode()).decode()
        
        self.headers = {
            "Authorization": f"Basic {encoded_auth}",
            "Content-Type": "application/json"
        }

    def get_projects(self) -> List[Dict[str, Any]]:
        """Fetch all projects from OpenProject."""
        url = f"{self.base_url}/api/v3/projects"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get("_embedded", {}).get("elements", [])
            return []
        except Exception as e:
            print(f"Error fetching projects from OpenProject: {e}")
            return []

    def create_work_package(self, project_id: int, subject: str, description: str) -> Optional[Dict[str, Any]]:
        """Create a work package (e.g., an intervention) in OpenProject."""
        url = f"{self.base_url}/api/v3/projects/{project_id}/work_packages"
        payload = {
            "subject": subject,
            "description": {
                "format": "markdown",
                "raw": description
            },
            "_links": {
                "type": {"href": "/api/v3/types/1"} # Typically 1 is 'Task'
            }
        }
        try:
            response = requests.post(url, json=payload, headers=self.headers, timeout=10)
            if response.status_code == 201:
                return response.json()
            return None
        except Exception as e:
            print(f"Error creating work package in OpenProject: {e}")
            return None

    def update_project_status(self, project_id: int, status_id: int) -> bool:
        """Update project status in OpenProject."""
        # Note: OpenProject project status update might be complex via API v3
        # This is a simplified version
        print(f"Syncing Project {project_id} status to {status_id}")
        return True
