import uuid
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
import os
import threading
import json

app = Flask(__name__)
CORS(app)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STATE_FILE = os.path.join(BASE_DIR, "data", "state.json")
STATE_LOCK = threading.Lock()

def daysFromNow(d):
    dt = datetime.now() + timedelta(days=d)
    dt = dt.replace(hour=10, minute=0, second=0, microsecond=0)
    return dt.isoformat() + "Z"

def get_data():
    return {
      "hackathons": [
        {
          "id": "hx-hack-neoai",
          "type": "hackathon",
          "title": "NeoAI Build Sprint",
          "venue": "Bengaluru \u2022 Hirex Arena",
          "mode": "offline",
          "domain": ["AI", "Product", "LLMs"],
          "startAt": daysFromNow(6),
          "duration": "36 hours",
          "teamSize": "2\u20134",
          "fee": 499,
          "verified": True,
          "trust": 92,
          "details": "A fast-paced, team-based hackathon focused on practical AI products. Build an end-to-end prototype with a crisp pitch and measurable impact.",
          "reviews": [
            { "name": "Shivam", "rating": 5, "text": "Great event, well organized. Mentors were super helpful." },
            { "name": "Aryan", "rating": 4, "text": "Solid problems and smooth registration process." },
            { "name": "Mayuresh", "rating": 5, "text": "Loved the venue and the judging quality." },
            { "name": "Shradha", "rating": 4, "text": "Well-managed schedule and good networking." }
          ]
        },
        {
          "id": "hx-hack-blueweb",
          "type": "hackathon",
          "title": "BlueWeb Hackfest",
          "venue": "Online \u2022 Live Rooms",
          "mode": "online",
          "domain": ["Web", "DevTools", "Open Source"],
          "startAt": daysFromNow(3),
          "duration": "24 hours",
          "teamSize": "1\u20133",
          "fee": 0,
          "verified": True,
          "trust": 88,
          "details": "A clean, web-first hackathon with starter kits and short technical workshops. Great for students who want a realistic sprint experience.",
          "reviews": [
            { "name": "M.S.Dhoni", "rating": 5, "text": "Very useful workshop + hack combo. Great resources." },
            { "name": "Virat Kohli", "rating": 4, "text": "Smooth and beginner-friendly. Good pacing." },
            { "name": "Rohit Sharma", "rating": 4, "text": "Loved the project themes and quick feedback." }
          ]
        },
        {
          "id": "hx-hack-fintech",
          "type": "hackathon",
          "title": "FinTech Forge Weekend",
          "venue": "Mumbai \u2022 Skyline Hub",
          "mode": "offline",
          "domain": ["FinTech", "Data", "Security"],
          "startAt": daysFromNow(12),
          "duration": "48 hours",
          "teamSize": "3\u20135",
          "fee": 799,
          "verified": False,
          "trust": 79,
          "details": "Build secure fintech workflows\u2014onboarding, fraud checks, and reconciliation. Includes a product track and a security track with focused evaluations.",
          "reviews": [
            { "name": "Ishaan Gupta", "rating": 4, "text": "Challenging tracks, good judges, realistic use-cases." },
            { "name": "Meera Nair", "rating": 3, "text": "Great content, though onboarding could be tighter." }
          ]
        }
      ],
      "workshops": [
        {
          "id": "hx-ws-uiux",
          "type": "workshop",
          "title": "Modern UI/UX for Product Teams",
          "organizer": "Hirex Studio",
          "mode": "online",
          "domain": ["UI/UX", "Design Systems"],
          "startAt": daysFromNow(2),
          "duration": "2 hours",
          "fee": 199,
          "verified": True,
          "trust": 94,
          "details": "Learn spacing, hierarchy, and component thinking. Includes a mini design-audit framework and practical templates.",
          "reviews": [
            { "name": "Priya", "rating": 5, "text": "Very useful workshop. Clear structure and examples." },
            { "name": "Kabir", "rating": 4, "text": "Great pacing and hands-on exercises." },
            { "name": "Sanjay", "rating": 5, "text": "Clean explanations and super practical tips." }
          ]
        },
        {
          "id": "hx-ws-mlops",
          "type": "workshop",
          "title": "MLOps Starter: Deploy & Monitor",
          "organizer": "CloudCraft Academy",
          "mode": "offline",
          "domain": ["AI", "MLOps", "Cloud"],
          "startAt": daysFromNow(9),
          "duration": "4 hours",
          "fee": 0,
          "verified": True,
          "trust": 87,
          "details": "A practical workshop covering deployment patterns, monitoring signals, and reliability basics for ML systems.",
          "reviews": [
            { "name": "Tanvi", "rating": 4, "text": "Good hands-on labs. Helpful instructor." },
            { "name": "Rohit", "rating": 4, "text": "Solid intro and realistic deployment scenarios." }
          ]
        }
      ],
      "seminars": [
        {
          "id": "hx-sem-career",
          "type": "seminar",
          "title": "Career Roadmaps: From Student to SDE",
          "host": "Hirex Community",
          "organizer": "TechTalks India",
          "mode": "online",
          "startAt": daysFromNow(1),
          "duration": "75 mins",
          "fee": 0,
          "verified": True,
          "trust": 90,
          "details": "A structured seminar on portfolios, interview prep, and building momentum with consistent projects.",
          "reviews": [
            { "name": "Ananya", "rating": 5, "text": "Great clarity and actionable steps." },
            { "name": "Vikram", "rating": 4, "text": "Very helpful Q&A session." }
          ]
        },
        {
          "id": "hx-sem-cyber",
          "type": "seminar",
          "title": "Security for Builders: Practical Threat Modeling",
          "host": "SecureOps Guild",
          "organizer": "SecureOps Guild",
          "mode": "offline",
          "startAt": daysFromNow(7),
          "duration": "90 mins",
          "fee": 299,
          "verified": False,
          "trust": 82,
          "details": "Learn realistic threat modeling in small steps and apply it to common product features.",
          "reviews": [
            { "name": "Harsh", "rating": 4, "text": "Good examples and simple frameworks." },
            { "name": "Nidhi", "rating": 4, "text": "Made security feel approachable." }
          ]
        }
      ],
      "opportunities": {
        "jobs": [
          {
            "id": "hx-job-frontend",
            "type": "job",
            "title": "Frontend Engineer (React)",
            "company": "BluePeak Labs",
            "domain": ["Web", "UI"],
            "location": "Remote (India)",
            "salaryMinLPA": 8,
            "salaryMaxLPA": 14,
            "verified": True,
            "trust": 91,
            "fee": 0,
            "details": "Build crisp UI experiences with strong component discipline. You'll collaborate with designers and ship weekly improvements.",
            "reviews": [
              { "name": "Nitin", "rating": 5, "text": "Quick application flow and transparent updates." },
              { "name": "Ira", "rating": 4, "text": "Clear role description and responsive recruiter." }
            ]
          },
          {
            "id": "hx-job-data",
            "type": "job",
            "title": "Data Analyst",
            "company": "FinSight",
            "domain": ["Data", "BI"],
            "location": "Pune (Hybrid)",
            "salaryMinLPA": 6,
            "salaryMaxLPA": 10,
            "verified": False,
            "trust": 78,
            "fee": 0,
            "details": "Work on dashboards and insights that power product decisions. Strong SQL + visualization focus.",
            "reviews": [
              { "name": "Madhav", "rating": 4, "text": "The requirements were realistic and well scoped." }
            ]
          },
          {
            "id": "hx-job-backend",
            "type": "job",
            "title": "Backend Developer (Python/Django)",
            "company": "NextGen AI",
            "domain": ["Backend", "AI"],
            "location": "Bengaluru (On-site)",
            "salaryMinLPA": 12,
            "salaryMaxLPA": 20,
            "verified": True,
            "trust": 95,
            "fee": 0,
            "details": "Design scalable microservices and integrate LLM models into production APIs. Requires strong system design skills.",
            "reviews": [
              { "name": "Aditya", "rating": 5, "text": "Challenging interview but a great team to work with." }
            ]
          }
        ],
        "internships": [
          {
            "id": "hx-int-ml",
            "type": "internship",
            "title": "ML Intern",
            "company": "CloudCraft Academy",
            "domain": ["AI", "Data"],
            "location": "Online",
            "schedule": "Part-time",
            "paid": True,
            "stipend": 15000,
            "mode": "online",
            "verified": True,
            "trust": 89,
            "fee": 0,
            "details": "Build datasets, train baseline models, and help with evaluation harnesses. Weekly mentor check-ins.",
            "reviews": [
              { "name": "Pooja", "rating": 5, "text": "Great mentorship and clear tasks." },
              { "name": "Yash", "rating": 4, "text": "Good learning curve and friendly team." }
            ]
          },
          {
            "id": "hx-int-product",
            "type": "internship",
            "title": "Product Intern",
            "company": "Hirex Studio",
            "domain": ["Product", "Research"],
            "location": "Delhi (On-site)",
            "schedule": "Full-time",
            "paid": False,
            "stipend": 0,
            "mode": "offline",
            "verified": True,
            "trust": 86,
            "fee": 0,
            "details": "Help run user interviews, convert insights into specs, and support experiments on onboarding flows.",
            "reviews": [
              { "name": "Srishti", "rating": 4, "text": "Great exposure to real product work." }
            ]
          },
          {
            "id": "hx-int-design",
            "type": "internship",
            "title": "UI/UX Design Intern",
            "company": "Creative Minds",
            "domain": ["Design", "Figma"],
            "location": "Remote",
            "schedule": "Part-time",
            "paid": True,
            "stipend": 10000,
            "mode": "online",
            "verified": True,
            "trust": 92,
            "fee": 0,
            "details": "Assist our lead designers in creating sleek mobile interfaces. Great opportunity for building your portfolio.",
            "reviews": [
              { "name": "Neha", "rating": 5, "text": "Very supportive leads and flexible hours." }
            ]
          },
          {
            "id": "hx-int-marketing",
            "type": "internship",
            "title": "Social Media Intern",
            "company": "BrandBoosters",
            "domain": ["Marketing", "Social Media"],
            "location": "Mumbai (Hybrid)",
            "schedule": "Part-time",
            "paid": False,
            "stipend": 0,
            "mode": "offline",
            "verified": False,
            "trust": 75,
            "fee": 0,
            "details": "Help curate content and manage campaigns. Unpaid, but offers a strong recommendation letter and hands-on experience.",
            "reviews": [
              { "name": "Rahul", "rating": 3, "text": "Unpaid, but good for raw experience." }
            ]
          }
        ],
        "freelancing": [
          {
            "id": "hx-free-ui-audit",
            "type": "freelance",
            "title": "Landing Page UI Audit + Refresh",
            "company": "NovaMart",
            "domain": ["UI/UX", "Web"],
            "budget": 12000,
            "duration": "1 week",
            "verified": True,
            "trust": 93,
            "fee": 0,
            "details": "Audit spacing, hierarchy, and conversion flow. Deliver a refreshed UI with 3 sections, responsive layout, and component guidelines.",
            "reviews": [
              { "name": "Farhan", "rating": 5, "text": "The client brief was clear; proposal submission was smooth." },
              { "name": "Shreya", "rating": 4, "text": "Good listing quality and quick responses." }
            ]
          },
          {
            "id": "hx-free-backend-api",
            "type": "freelance",
            "title": "API Integration (Payments Mock)",
            "company": "FinSight",
            "domain": ["Backend", "API"],
            "budget": 18000,
            "duration": "10 days",
            "verified": False,
            "trust": 77,
            "fee": 0,
            "details": "Integrate a mock payment provider and implement basic receipt email simulation (no real emails).",
            "reviews": [
              { "name": "Akash", "rating": 4, "text": "Budget and duration were realistic." }
            ]
          },
          {
            "id": "hx-free-mobile-app",
            "type": "freelance",
            "title": "React Native App Fixes",
            "company": "QuickStart Tech",
            "domain": ["Mobile", "React Native"],
            "budget": 25000,
            "duration": "2 weeks",
            "verified": True,
            "trust": 88,
            "fee": 0,
            "details": "Fix 3 specific bugs in an existing React Native codebase and deploy to TestFlight.",
            "reviews": [
              { "name": "Sneha", "rating": 4, "text": "Clear instructions, prompt payment." },
              { "name": "Arjun", "rating": 5, "text": "Excellent client to work with." }
            ]
          }
        ]
      }
    }


def minutesAgo(m):
    dt = datetime.now() - timedelta(minutes=m)
    return dt.isoformat() + "Z"

NETWORK_DATA = {
    "me": {
        "id": "usr-me",
        "name": "Shivam Gupta",
        "headline": "Full Stack Developer | Community Builder",
        "about": "Building practical products, mentoring students, and helping teams ship polished user experiences with measurable impact.",
        "photo": "SG",
        "skills": ["React", "Python", "Flask", "UI/UX", "SQL"],
        "experience": [
            { "role": "Frontend Developer", "company": "BluePeak Labs", "period": "2024 - Present" },
            { "role": "Community Lead", "company": "DevCircle", "period": "2022 - 2024" }
        ],
        "education": "B.Tech Computer Science • 2025",
        "projects": ["Hirex Platform", "Campus Mentor Hub"],
        "contact": "shivam@example.com"
    },
    "people": [
        { "id": "usr-1", "name": "Aditi Sharma", "role": "Product Manager", "skills": ["Product", "Growth", "Analytics"], "mutual": 14, "status": "none" },
        { "id": "usr-2", "name": "Kunal Mehta", "role": "Software Engineer", "skills": ["Backend", "API", "Python"], "mutual": 9, "status": "connected" },
        { "id": "usr-3", "name": "Riya Singh", "role": "Data Analyst", "skills": ["SQL", "Power BI", "Finance"], "mutual": 5, "status": "incoming" },
        { "id": "usr-4", "name": "Dev Patel", "role": "UI/UX Designer", "skills": ["Figma", "Design Systems", "Research"], "mutual": 11, "status": "none" },
        { "id": "usr-5", "name": "Meera Nair", "role": "Marketing Specialist", "skills": ["Marketing", "Content", "Brand"], "mutual": 6, "status": "none" },
        { "id": "usr-6", "name": "Harsh Verma", "role": "Cybersecurity Engineer", "skills": ["Security", "SOC", "Cloud"], "mutual": 4, "status": "connected" }
    ],
    "feed": [
        {
            "id": "nx1",
            "category": "markets",
            "breaking": True,
            "ticker": "APOLLO",
            "move": "+18%",
            "moveDir": "up",
            "title": "Apollo Micro Systems surged 18% on a government license for missile manufacturing",
            "deck": "The stock rallied sharply following the critical defense clearance.",
            "body": "Investors cheered the approval, viewing it as a major catalyst for the company's defense footprint. Trading volumes spiked to multi-month highs during morning trade.",
            "source": "MarketWire Defense",
            "at": minutesAgo(1)
        },
        {
            "id": "nx2",
            "category": "markets",
            "breaking": True,
            "ticker": "GUJGAS",
            "move": "+8%",
            "moveDir": "up",
            "title": "Gujarat Gas jumped 8% following a rating upgrade to 'buy'",
            "deck": "Multiple brokerages turned bullish citing improved margin visibility.",
            "body": "The rating upgrades pointed to easing raw material costs and stabilizing industrial demand, prompting aggressive buying from institutional desks across the board.",
            "source": "CapitalDesk",
            "at": minutesAgo(3)
        },
        {
            "id": "n1",
            "category": "markets",
            "breaking": True,
            "ticker": "NIFTY 50",
            "move": "+0.58%",
            "moveDir": "up",
            "title": "Nifty reclaims 24,200 as IT majors lift benchmarks",
            "deck": "Buying returned across large-caps after a steady start to the session.",
            "body": "Traders pointed to fresh allocations in software services and selective PSU banks.",
            "source": "MarketWire Live",
            "at": minutesAgo(5)
        },
        {
            "id": "n2",
            "category": "markets",
            "breaking": False,
            "ticker": "SENSEX",
            "move": "+0.41%",
            "moveDir": "up",
            "title": "Sensex extends gains; investors watch currency and crude",
            "deck": "The rupee and Brent moves are in focus.",
            "body": "Desk commentary highlights a preference for quality balance sheets.",
            "source": "CapitalDesk",
            "at": minutesAgo(18)
        },
        {
            "id": "n5",
            "category": "tech",
            "breaking": True,
            "title": "Chip majors signal sustained AI accelerator demand through 2026",
            "deck": "Cloud hyperscalers are still expanding GPU clusters.",
            "body": "Supply chains for advanced packaging remain tight.",
            "source": "Silicon Brief",
            "at": minutesAgo(7)
        }
    ],
    "companyPosts": [
        { "id": "req-1", "title": "Hiring: Junior Frontend Engineer", "company": "BluePeak Labs", "domain": "Web", "location": "Remote", "kind": "Job", "description": "Need strong React fundamentals, API integration." },
        { "id": "req-2", "title": "Need UI Audit Consultant", "company": "NovaMart", "domain": "UI/UX", "location": "Mumbai", "kind": "Service", "description": "Looking for UI experts to audit journeys." }
    ],
    "opportunityPosts": [
        { "id": "op-1", "title": "Hiring Need: Data Intern", "company": "FinSight", "domain": "Data", "location": "Pune", "kind": "Hiring need", "description": "Internship role for dashboarding, reporting." },
        { "id": "op-2", "title": "Open Requirement: Security Analyst", "company": "SecureOps Guild", "domain": "Security", "location": "Delhi", "kind": "Job", "description": "Entry role for threat detection." }
    ]
}
          {
            "id": "hx-free-ui-audit",
            "type": "freelance",
            "title": "Landing Page UI Audit + Refresh",
            "company": "NovaMart",
            "domain": ["UI/UX", "Web"],
"title": "Landing Page UI Audit + Refresh",
          "company": "NovaMart",
          "domain": ["UI/UX", "Web"],
          "budget": 12000,
          "duration": "1 week",
          "verified": True,
          "trust": 93,
          "fee": 0,
          "details": "Audit spacing, hierarchy, and conversion flow.def minutesAgo(m):
    dt = datetime.now() - timedelta(minutes=m)
    return dt.isoformat() + "Z"

NETWORK_DATA = {
    "me": {
        "id": "usr-me",
        "name": "Shivam Gupta",
        "headline": "Full Stack Developer | Community Builder",
        "about": "Building practical products, mentoring students, and helping teams ship polished user experiences with measurable impact.",
        "photo": "SG",
        "skills": ["React", "Python", "Flask", "UI/UX", "SQL"],
        "experience": [
            { "role": "Frontend Developer", "company": "BluePeak Labs", "period": "2024 - Present" },
            { "role": "Community Lead", "company": "DevCircle", "period": "2022 - 2024" }
        ],
        "education": "B.Tech Computer Science • 2025",
        "projects": ["Hirex Platform", "Campus Mentor Hub"],
        "contact": "shivam@example.com"
    },
    "people": [
        { "id": "usr-1", "name": "Aditi Sharma", "role": "Product Manager", "skills": ["Product", "Growth", "Analytics"], "mutual": 14, "status": "none" },
        { "id": "usr-2", "name": "Kunal Mehta", "role": "Software Engineer", "skills": ["Backend", "API", "Python"], "mutual": 9, "status": "connected" },
        { "id": "usr-3", "name": "Riya Singh", "role": "Data Analyst", "skills": ["SQL", "Power BI", "Finance"], "mutual": 5, "status": "incoming" },
        { "id": "usr-4", "name": "Dev Patel", "role": "UI/UX Designer", "skills": ["Figma", "Design Systems", "Research"], "mutual": 11, "status": "none" },
        { "id": "usr-5", "name": "Meera Nair", "role": "Marketing Specialist", "skills": ["Marketing", "Content", "Brand"], "mutual": 6, "status": "none" },
        { "id": "usr-6", "name": "Harsh Verma", "role": "Cybersecurity Engineer", "skills": ["Security", "SOC", "Cloud"], "mutual": 4, "status": "connected" }
    ],
    "feed": [
        {
            "id": "nx1",
            "category": "markets",
            "breaking": True,
            "ticker": "APOLLO",
            "move": "+18%",
            "moveDir": "up",
            "title": "Apollo Micro Systems surged 18% on a government license for missile manufacturing",
            "deck": "The stock rallied sharply following the critical defense clearance.",
            "body": "Investors cheered the approval, viewing it as a major catalyst for the company's defense footprint. Trading volumes spiked to multi-month highs.",
            "source": "MarketWire Defense",
            "at": minutesAgo(1)
        },
        {
            "id": "nx2",
            "category": "markets",
            "breaking": True,
            "ticker": "GUJGAS",
            "move": "+8%",
            "moveDir": "up",
            "title": "Gujarat Gas jumped 8% following a rating upgrade to 'buy'",
            "deck": "Multiple brokerages turned bullish citing improved margin visibility.",
            "body": "The rating upgrades pointed to easing raw material costs and stabilizing industrial demand, prompting aggressive buying.",
            "source": "CapitalDesk",
            "at": minutesAgo(3)
        },
        {
            "id": "n1",
            "category": "markets",
            "breaking": True,
            "ticker": "NIFTY 50",
            "move": "+0.58%",
            "moveDir": "up",
            "title": "Nifty reclaims 24,200 as IT majors lift benchmarks",
            "deck": "Buying returned across large-caps after a steady start.",
            "body": "Traders pointed to fresh allocations in software services and selective PSU banks.",
            "source": "MarketWire Live",
            "at": minutesAgo(5)
        },
        {
            "id": "n2",
            "category": "markets",
            "breaking": False,
            "ticker": "SENSEX",
            "move": "+0.41%",
            "moveDir": "up",
            "title": "Sensex extends gains; investors watch currency and crude",
            "deck": "The rupee and Brent moves are in focus.",
            "body": "Desk commentary highlights a preference for quality balance sheets.",
            "source": "CapitalDesk",
            "at": minutesAgo(18)
        },
        {
            "id": "n5",
            "category": "tech",
            "breaking": True,
            "title": "Chip majors signal sustained AI accelerator demand through 2026",
            "deck": "Cloud hyperscalers are still expanding GPU clusters.",
            "body": "Supply chains for advanced packaging remain tight.",
            "source": "Silicon Brief",
            "at": minutesAgo(7)
        }
    ],
    "companyPosts": [
        { "id": "req-1", "title": "Hiring: Junior Frontend Engineer", "company": "BluePeak Labs", "domain": "Web", "location": "Remote", "kind": "Job", "description": "Need strong React fundamentals, API integration." },
        { "id": "req-2", "title": "Need UI Audit Consultant", "company": "NovaMart", "domain": "UI/UX", "location": "Mumbai", "kind": "Service", "description": "Looking for UI experts to audit journeys." }
    ],
    "opportunityPosts": [
        { "id": "op-1", "title": "Hiring Need: Data Intern", "company": "FinSight", "domain": "Data", "location": "Pune", "kind": "Hiring need", "description": "Internship role for dashboarding, reporting." },
        { "id": "op-2", "title": "Open Requirement: Security Analyst", "company": "SecureOps Guild", "domain": "Security", "location": "Delhi", "kind": "Job", "description": "Entry role for threat detection." }
    ]
}

# Dummy in-memory DB for states
# In a real app this would be tied to user sessions/IDs

def ensure_state_file():
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    if not os.path.exists(STATE_FILE):
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump({"registrations": {}, "saves": {}}, f, ensure_ascii=False, indent=2)


def load_state():
    ensure_state_file()
    with STATE_LOCK:
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return {
                    "registrations": data.get("registrations", {}),
                    "saves": data.get("saves", {}),
                }
        except Exception:
            return {"registrations": {}, "saves": {}}


def save_state(state):
    ensure_state_file()
    with STATE_LOCK:
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state, f, ensure_ascii=False, indent=2)


state_db = load_state()



def get_network_data():
    global state_db
    conns = state_db.get("connections", {})
    # Deep copy to avoid mutating global template
    data = json.loads(json.dumps(NETWORK_DATA))
    for p in data["people"]:
        if p["id"] in conns:
            p["status"] = conns[p["id"]]
    return data

@app.route('/api/network', methods=['GET'])
def get_network_details():
    return jsonify(get_network_data())

@app.route('/api/network/connect', methods=['POST'])
def network_connect():
    global state_db
    req = request.json
    target_id = req.get('userId')
    action = req.get('action') # "connect", "accept", "reject"
    
    if "connections" not in state_db:
        state_db["connections"] = {}
        
    if action == "connect":
        state_db["connections"][target_id] = "requested"
    elif action == "accept":
        state_db["connections"][target_id] = "connected"
    elif action == "reject":
        state_db["connections"][target_id] = "none"
        
    save_state(state_db)
    return jsonify(get_network_data())

@app.route('/api/data', methods=['GET'])
def get_all_data():
    return jsonify(get_data())

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "hirex-api"})

@app.route('/api/state', methods=['GET'])
def get_user_state():
    global state_db
    state_db = load_state()
    return jsonify(state_db)

@app.route('/api/reset', methods=['POST'])
def reset_state():
    global state_db
    state_db["registrations"] = {}
    state_db["saves"] = {}
    state_db["connections"] = {}
    save_state(state_db)
    return jsonify({"message": "State reset", "state": state_db})

@app.route('/api/save', methods=['POST'])
def toggle_save():
    global state_db
    req = request.json
    item_id = req.get('itemId')
    is_saved = req.get('isSaved', False)
    if is_saved:
        state_db['saves'][item_id] = True
    else:
        state_db['saves'].pop(item_id, None)
    save_state(state_db)
    return jsonify(state_db)

@app.route('/api/register', methods=['POST'])
def register_item():
    global state_db
    req = request.json
    item = req.get('item')
    payload = req.get('payload')
    payment_status = req.get('paymentStatus') # "paid" or "not_required"
    receipt = req.get('receiptId', '')
    
    amount = item.get('fee', 0)
    
    state_db['registrations'][item['id']] = {
        "id": uuid.uuid4().hex[:8],
        "itemId": item['id'],
        "type": item['type'],
        "createdAt": datetime.now().isoformat() + "Z",
        "status": "confirmed" if payment_status == 'paid' else ("applied" if "resumeFile" in payload else "confirmed"),
        "payment": {
            "status": payment_status,
            "amount": amount,
            "receiptId": receipt,
            "email": payload.get('email', '')
        } if payment_status == "paid" else {"status": "not_required", "amount": 0},
        "cancellation": { "status": "active" },
        "form": payload
    }
    save_state(state_db)
    return jsonify(state_db)

@app.route('/api/apply', methods=['POST'])
def apply_item():
    global state_db
    # Application is similar to free registration, but status="applied"
    req = request.json
    item = req.get('item')
    payload = req.get('payload')
    
    state_db['registrations'][item['id']] = {
        "id": uuid.uuid4().hex[:8],
        "itemId": item['id'],
        "type": item['type'],
        "createdAt": datetime.now().isoformat() + "Z",
        "status": "applied",
        "payment": { "status": "not_required", "amount": 0 },
        "cancellation": { "status": "active" },
        "form": payload
    }
    save_state(state_db)
    return jsonify(state_db)


@app.route('/api/cancel', methods=['POST'])
def cancel_registration():
    global state_db
    req = request.json
    item = req.get('item')
    reason = req.get('reason', 'User cancelled')
    by_organizer = req.get('byOrganizer', False)
    
    reg = state_db['registrations'].get(item['id'])
    if not reg:
        return jsonify(state_db)
    
    paid = (reg['payment']['status'] == 'paid')
    amount = reg['payment']['amount']
    
    if by_organizer:
        reg['cancellation'] = {
            "status": "cancelled_by_organizer",
            "reason": "Cancelled by organizer",
            "at": datetime.now().isoformat() + "Z"
        }
        reg['refund'] = {
            "status": "refunded", "amount": amount, "at": datetime.now().isoformat() + "Z", "reason": "Organizer cancelled"
        } if paid else {"status": "not_required", "amount": 0}
        
    else:
        # User cancel
        started = req.get('eventStarted', False)
        refundable = paid and not started
        
        reg['cancellation'] = {
            "status": "cancelled_by_user",
            "reason": reason,
            "at": datetime.now().isoformat() + "Z"
        }
        
        if paid:
            reg['refund'] = {
                "status": "refunded", "amount": amount, "at": datetime.now().isoformat() + "Z", "reason": "Cancelled before start"
            } if refundable else {
                "status": "not_applicable", "amount": 0, "reason": "Event already started"
            }
        else:
            reg['refund'] = {"status": "not_required", "amount": 0}
        
    state_db['registrations'][item['id']] = reg
    save_state(state_db)
    return jsonify(state_db)


@app.route("/", methods=["GET"])
def serve_index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:path>", methods=["GET"])
def serve_static(path):
    if path.startswith("api/"):
        abort(404)
    file_path = os.path.join(BASE_DIR, path)
    if not os.path.isfile(file_path):
        return send_from_directory(BASE_DIR, "index.html")
    return send_from_directory(BASE_DIR, path)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
