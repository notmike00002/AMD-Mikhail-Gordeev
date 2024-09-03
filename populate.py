from datetime import datetime, timedelta
import random
import bcrypt
from bson import ObjectId
from pymongo import MongoClient
import pymongo

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['waste_management']

# Clear existing data
db.users.delete_many({})
db.waste_categories.delete_many({})
db.waste_items.delete_many({})
db.challenges.delete_many({})

# Helper function to hash passwords


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


# Create users
users = [
    {"name": "Alice Smith", "email": "alice@example.com",
        "password": hash_password("password123"), "score": 0},
    {"name": "Bob Johnson", "email": "bob@example.com",
        "password": hash_password("password456"), "score": 0},
    {"name": "Charlie Brown", "email": "charlie@example.com",
        "password": hash_password("password789"), "score": 0},
]

user_ids = db.users.insert_many(users).inserted_ids
print(f"Users created: {len(user_ids)}")

# Create waste categories
categories = [
    {"name": "Recyclable", "description": "Materials that can be recycled",
        "disposalGuidelines": "Clean and place in recycling bin"},
    {"name": "Organic", "description": "Biodegradable waste",
        "disposalGuidelines": "Place in compost bin or green waste collection"},
    {"name": "Electronic", "description": "Electronic devices and components",
        "disposalGuidelines": "Take to e-waste recycling center"},
    {"name": "Hazardous", "description": "Dangerous or toxic materials",
        "disposalGuidelines": "Dispose at designated hazardous waste facilities"},
]

category_ids = db.waste_categories.insert_many(categories).inserted_ids
print(f"Waste Categories created: {len(category_ids)}")

# Verify waste categories
categories_count = db.waste_categories.count_documents({})
print(f"Total Waste Categories in database: {categories_count}")

# Create waste items
items = [
    {"name": "Plastic Bottle", "category": str(
        category_ids[0]), "sortingInstructions": "Rinse and remove cap before recycling"},
    {"name": "Banana Peel", "category": str(
        category_ids[1]), "sortingInstructions": "Place in compost bin"},
    {"name": "Old Smartphone", "category": str(
        category_ids[2]), "sortingInstructions": "Remove battery and take to e-waste center"},
    {"name": "Paint Can", "category": str(
        category_ids[3]), "sortingInstructions": "If not empty, take to hazardous waste collection site"},
    {"name": "Cardboard Box", "category": str(
        category_ids[0]), "sortingInstructions": "Flatten and place in recycling bin"},
    {"name": "Coffee Grounds", "category": str(
        category_ids[1]), "sortingInstructions": "Can be composted or used as garden fertilizer"},
]

item_ids = db.waste_items.insert_many(items).inserted_ids
print(f"Waste Items created: {len(item_ids)}")

# Verify waste items
items_count = db.waste_items.count_documents({})
print(f"Total Waste Items in database: {items_count}")

# Create challenges
challenges = [
    {"description": "Sort 10 items correctly", "difficultyLevel": "easy",
        "scoringCriteria": "1 point per correct item"},
    {"description": "Identify 5 hazardous waste items", "difficultyLevel": "medium",
        "scoringCriteria": "2 points per correct identification"},
    {"description": "Create a recycling plan for your home",
        "difficultyLevel": "hard", "scoringCriteria": "10 points for a complete plan"},
]

challenge_ids = db.challenges.insert_many(challenges).inserted_ids
print(f"Challenges created: {len(challenge_ids)}")

print("\nDatabase populated with test data:")
print(f"Users: {db.users.count_documents({})}")
print(f"Waste Categories: {db.waste_categories.count_documents({})}")
print(f"Waste Items: {db.waste_items.count_documents({})}")
print(f"Challenges: {db.challenges.count_documents({})}")

# Verify references
for item in db.waste_items.find():
    category = db.waste_categories.find_one(
        {"_id": ObjectId(item["category"])})
    if category:
        print(
            f"Item '{item['name']}' correctly references category '{category['name']}'")
    else:
        print(
            f"Warning: Item '{item['name']}' references non-existent category")
