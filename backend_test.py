#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class NeuronAPITester:
    def __init__(self, base_url="https://hackathon-neuron.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def test_health_check(self):
        """Test API health endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.json() if success else response.text}"
            self.log_test("API Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("API Health Check", False, f"Error: {str(e)}")
            return False

    def test_admin_login(self, username="admin", password="NeuronAdmin@2025"):
        """Test admin login"""
        try:
            response = requests.post(
                f"{self.api_url}/auth/admin-login",
                json={"username": username, "password": password},
                timeout=10
            )
            
            success = response.status_code == 200
            if success:
                data = response.json()
                self.token = data.get('access_token')
                details = f"Login successful, token received: {bool(self.token)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login", False, f"Error: {str(e)}")
            return False

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        try:
            response = requests.post(
                f"{self.api_url}/auth/admin-login",
                json={"username": "invalid", "password": "invalid"},
                timeout=10
            )
            
            success = response.status_code == 401
            details = f"Status: {response.status_code} (expected 401)"
            self.log_test("Admin Login - Invalid Credentials", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login - Invalid Credentials", False, f"Error: {str(e)}")
            return False

    def test_create_registration(self):
        """Test creating a new registration"""
        test_data = {
            "full_name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "+91 9876543210",
            "college": "Test College",
            "team_name": "Test Team",
            "honeypot": ""  # Should be empty for valid submission
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/registrations",
                json=test_data,
                timeout=10
            )
            
            success = response.status_code == 200
            if success:
                data = response.json()
                reg_id = data.get('registration_id')
                details = f"Registration created with ID: {reg_id}"
                # Store for payment test
                self.test_registration_id = reg_id
                self.test_registration_data = test_data
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Create Registration", success, details)
            return success
        except Exception as e:
            self.log_test("Create Registration", False, f"Error: {str(e)}")
            return False

    def test_duplicate_email_registration(self):
        """Test duplicate email registration prevention"""
        if not hasattr(self, 'test_registration_data'):
            self.log_test("Duplicate Email Registration", False, "No previous registration data")
            return False
            
        try:
            # Try to register with same email
            response = requests.post(
                f"{self.api_url}/registrations",
                json=self.test_registration_data,
                timeout=10
            )
            
            success = response.status_code == 400
            details = f"Status: {response.status_code} (expected 400 for duplicate)"
            self.log_test("Duplicate Email Registration", success, details)
            return success
        except Exception as e:
            self.log_test("Duplicate Email Registration", False, f"Error: {str(e)}")
            return False

    def test_honeypot_protection(self):
        """Test honeypot CAPTCHA protection"""
        test_data = {
            "full_name": "Bot User",
            "email": "bot@example.com",
            "phone": "+91 9876543210",
            "college": "Bot College",
            "team_name": "Bot Team",
            "honeypot": "I am a bot"  # This should trigger rejection
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/registrations",
                json=test_data,
                timeout=10
            )
            
            success = response.status_code == 400
            details = f"Status: {response.status_code} (expected 400 for bot detection)"
            self.log_test("Honeypot Protection", success, details)
            return success
        except Exception as e:
            self.log_test("Honeypot Protection", False, f"Error: {str(e)}")
            return False

    def test_payment_order_creation(self):
        """Test Razorpay order creation"""
        if not hasattr(self, 'test_registration_id'):
            self.log_test("Payment Order Creation", False, "No registration ID available")
            return False
            
        try:
            order_data = {
                "amount": 50000,  # 500 INR in paise
                "registration_id": self.test_registration_id,
                "full_name": self.test_registration_data['full_name'],
                "email": self.test_registration_data['email'],
                "phone": self.test_registration_data['phone']
            }
            
            response = requests.post(
                f"{self.api_url}/payment/create-order",
                json=order_data,
                timeout=10
            )
            
            success = response.status_code == 200
            if success:
                data = response.json()
                order_id = data.get('order_id')
                details = f"Order created with ID: {order_id}, Amount: {data.get('amount')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Payment Order Creation", success, details)
            return success
        except Exception as e:
            self.log_test("Payment Order Creation", False, f"Error: {str(e)}")
            return False

    def test_get_registrations_unauthorized(self):
        """Test getting registrations without auth"""
        try:
            response = requests.get(f"{self.api_url}/registrations", timeout=10)
            success = response.status_code == 401
            details = f"Status: {response.status_code} (expected 401)"
            self.log_test("Get Registrations - Unauthorized", success, details)
            return success
        except Exception as e:
            self.log_test("Get Registrations - Unauthorized", False, f"Error: {str(e)}")
            return False

    def test_get_registrations_authorized(self):
        """Test getting registrations with auth"""
        if not self.token:
            self.log_test("Get Registrations - Authorized", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.api_url}/registrations", headers=headers, timeout=10)
            
            success = response.status_code == 200
            if success:
                data = response.json()
                details = f"Retrieved {len(data)} registrations"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Registrations - Authorized", success, details)
            return success
        except Exception as e:
            self.log_test("Get Registrations - Authorized", False, f"Error: {str(e)}")
            return False

    def test_get_stats(self):
        """Test getting registration stats"""
        if not self.token:
            self.log_test("Get Registration Stats", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.api_url}/registrations/stats", headers=headers, timeout=10)
            
            success = response.status_code == 200
            if success:
                data = response.json()
                details = f"Stats: Total={data.get('total_registrations')}, Paid={data.get('paid_registrations')}, Revenue=₹{data.get('total_revenue_inr')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Registration Stats", success, details)
            return success
        except Exception as e:
            self.log_test("Get Registration Stats", False, f"Error: {str(e)}")
            return False

    def test_export_registrations(self):
        """Test CSV export functionality"""
        if not self.token:
            self.log_test("Export Registrations", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.api_url}/registrations/export", headers=headers, timeout=10)
            
            success = response.status_code == 200 and 'text/csv' in response.headers.get('content-type', '')
            if success:
                details = f"CSV export successful, size: {len(response.content)} bytes"
            else:
                details = f"Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}"
            
            self.log_test("Export Registrations", success, details)
            return success
        except Exception as e:
            self.log_test("Export Registrations", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Neuron Club Backend API Tests")
        print(f"🔗 Testing API at: {self.api_url}")
        print("=" * 60)
        
        # Basic connectivity
        if not self.test_health_check():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Authentication tests
        self.test_admin_login_invalid()
        if not self.test_admin_login():
            print("❌ Admin login failed. Stopping auth-required tests.")
        
        # Registration tests
        self.test_create_registration()
        self.test_duplicate_email_registration()
        self.test_honeypot_protection()
        
        # Payment tests
        self.test_payment_order_creation()
        
        # Admin functionality tests
        self.test_get_registrations_unauthorized()
        self.test_get_registrations_authorized()
        self.test_get_stats()
        self.test_export_registrations()
        
        # Summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = NeuronAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
                'timestamp': datetime.now().isoformat()
            },
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())