// src/assets/data.js

// --- Sample JSON Data ---
// This data will be used as the initial state if no data is found in AsyncStorage.
export const initialEmployeeData = [
  {
    "id": "emp001",
    "name": "Rahul Sharma",
    "department": "Engineering",
    "punches": [
      {
        "date": "2025-07-12",
        "punchIn": "09:05",
        "punchOut": "18:10"
      },
      {
        "date": "2025-07-11",
        "punchIn": "09:15",
        "punchOut": "17:50"
      },
      {
        "date": "2025-07-13",
        "punchIn": "08:55",
        "punchOut": "17:45"
      },
      {
        "date": "2025-07-14", // Today's date with empty punches
        "punchIn": "",
        "punchOut": ""
      }
    ]
  },
  {
    "id": "emp002",
    "name": "Sneha Verma",
    "department": "HR",
    "punches": [
      {
        "date": "2025-07-12",
        "punchIn": "09:45",
        "punchOut": "18:00"
      },
      {
        "date": "2025-07-11",
        "punchIn": "09:00",
        "punchOut": "17:30"
      },
      {
        "date": "2025-07-13",
        "punchIn": "08:50",
        "punchOut": "17:40"
      },
      {
        "date": "2025-07-14", // Today's date with empty punches
        "punchIn": "",
        "punchOut": ""
      }
    ]
  },
  {
    "id": "emp003",
    "name": "Amit Patel",
    "department": "Finance",
    "punches": [
      {
        "date": "2025-07-12",
        "punchIn": "08:55",
        "punchOut": "17:40"
      },
      {
        "date": "2025-07-11",
        "punchIn": "08:45",
        "punchOut": "17:35"
      },
      {
        "date": "2025-07-13",
        "punchIn": "08:40",
        "punchOut": "17:30"
      },
      {
        "date": "2025-07-14", // Today's date with empty punches
        "punchIn": "",
        "punchOut": ""
      }
    ]
  },
  {
    "id": "emp004",
    "name": "Priya Nair",
    "department": "Operations",
    "punches": [
      {
        "date": "2025-07-12",
        "punchIn": "08:50",
        "punchOut": "18:00"
      },
      {
        "date": "2025-07-11",
        "punchIn": "08:40",
        "punchOut": "17:45"
      },
      {
        "date": "2025-07-13",
        "punchIn": "09:00",
        "punchOut": "17:55"
      },
      {
        "date": "2025-07-14", // Today's date with empty punches
        "punchIn": "",
        "punchOut": ""
      }
    ]
  },
  {
    "id": "emp005",
    "name": "Karan Mehta",
    "department": "IT Support",
    "punches": [
      {
        "date": "2025-07-11",
        "punchIn": "09:05",
        "punchOut": "17:50"
      },
      {
        "date": "2025-07-12",
        "punchIn": "08:50",
        "punchOut": "17:50"
      },
      {
        "date": "2025-07-13",
        "punchIn": "09:10",
        "punchOut": "17:55"
      },
      {
        "date": "2025-07-14", // Today's date with empty punches
        "punchIn": "",
        "punchOut": ""
      }
    ]
  }
];
