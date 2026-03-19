import os
import requests
from typing import Optional, Dict, Any

class SageX3Client:
    """Client for Sage X3 Integration (supporting SOAP/REST logic)."""

    def __init__(self):
        self.url = os.getenv("SAGEX3_URL", "https://your-sagex3-instance.com/api")
        self.user = os.getenv("SAGEX3_USER", "admin")
        self.password = os.getenv("SAGEX3_PASS", "")

    def get_customer(self, erp_customer_id: str) -> Optional[Dict[str, Any]]:
        """Fetch customer info from Sage X3."""
        # Typically would call a Sage X3 subprogram or object via SOAP/REST
        print(f"Fetching Customer {erp_customer_id} from Sage X3")
        # For now, return a structured mock that matches our DB schema
        return {
            "erp_customer_id": erp_customer_id, 
            "name": f"Customer {erp_customer_id} (Synced from Sage X3)", 
            "active": True
        }

    def log_material_consumption(self, intervention_id: int, material_code: str, qty: float) -> bool:
        """Send material usage to Sage X3 for inventory deduction."""
        payload = {
            "intervention": intervention_id,
            "material": material_code,
            "quantity": qty,
            "user": self.user
        }
        try:
            # response = requests.post(f"{self.url}/consumption", json=payload, auth=(self.user, self.password))
            print(f"Logging {qty}x of {material_code} for intervention {intervention_id} to Sage X3")
            return True
        except Exception as e:
            print(f"Error logging to Sage X3: {e}")
            return False
