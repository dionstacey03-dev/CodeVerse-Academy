import unittest

from main import app, get_courses, health_check, home


class ApiContractTests(unittest.TestCase):
    def test_health_endpoint_payload(self):
        self.assertEqual(health_check()["status"], "healthy")

    def test_root_payload(self):
        payload = home()
        self.assertEqual(payload["status"], "online")
        self.assertEqual(payload["version"], "0.1.0")

    def test_course_catalog_is_consistent(self):
        payload = get_courses()
        self.assertEqual(payload["total"], 6)
        self.assertEqual(payload["total"], len(payload["courses"]))
        ids = [course["id"] for course in payload["courses"]]
        self.assertEqual(len(ids), len(set(ids)))
        for course in payload["courses"]:
            self.assertTrue(course["title"])
            self.assertTrue(course["language"])
            self.assertTrue(course["description"])

    def test_cors_is_restricted_to_read_only_methods(self):
        cors = next(
            middleware for middleware in app.user_middleware
            if middleware.cls.__name__ == "CORSMiddleware"
        )
        self.assertNotIn("*", cors.kwargs["allow_origins"])
        self.assertEqual(
            set(cors.kwargs["allow_methods"]),
            {"GET", "HEAD", "OPTIONS"},
        )
        self.assertFalse(cors.kwargs["allow_credentials"])


if __name__ == "__main__":
    unittest.main()
