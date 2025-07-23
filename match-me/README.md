# Match-Me Web

**Match-Me Web** is a full-stack recommendation platform that connects users based on profile data such as interests, preferences, characteristics, and location.

---

## 🌟 Project Overview

Sometimes it's difficult to make meaningful connections. Whether you're looking for a friend, a co-founder, a board game buddy, or someone who enjoys similar music, Match-Me helps you discover and connect with people who are a great fit.

---

## 🛠 Functional Features

### ✅ User Features
- User registration with email & password
- Secure login with JWT sessions
- Profile setup with at least 5 biographical data points
- Profile picture upload/change/remove
- Biographical preferences for better matching
- Real-time chat with typing and unread indicators
- Connections & requests management
- Privacy-respecting API and profile visibility

### 🎯 Recommendation System
The recommendation system is designed to match users based on profile compatibility and personal preferences using a weighted scoring model. Below is a breakdown of how it works:

### 1. **Filtering Candidates**
- Retrieves the current user's profile and preferences.
- Filters out candidates based on:
  - Geographical radius
  - Age range
  - Excludes the current user

### 2. **Preliminary Checks**
- Ensures the candidate's gender and relationship preferences align with the user's.
- Discards candidates with no overlapping relationship types.

### 3. **Scoring Criteria**
Each candidate is scored based on the following weighted factors:
| Criteria             | Weight |
|----------------------|--------|
| Gender Match         | 15%    |
| Relationship Match   | 15%    |
| About Me Similarity  | 15%    |
| Interests Similarity | 25%    |
| Lifestyle Match      | 15%    |
| Language Match       | 15%    |

- **About Me**: Tokenized, stemmed, and filtered for stopwords; similarity is based on word overlap.
- **Interests**: Grouped by category and scored using average Jaccard similarity.
- **Lifestyle & Language**: Compared using list overlap (Jaccard similarity).
- **Final Score**: Only candidates scoring ≥ 30% are considered.

### 4. **Results**
- The top 10 matching candidates are returned, sorted by score in descending order.
- Scoring is parallelized for performance.


### 🌍 Location Features
- Location sense-checking or GPS-based filtering
- Maximum radius control for realistic recommendations

---

## 💬 Chat
- Real-time messaging (WebSocket-based)
- Chat view with time stamps and online indicators
- Chat list sorted by recent activity
- Pagination for chat history

---

## 🔐 Security
- Email never exposed in API responses (except to user)
- API returns 404 when access is not allowed (prevents ID probing)
- Proper access control on profile visibility

---

## 🔗 Endpoints

| Endpoint              | Description                              |
|-----------------------|------------------------------------------|
| `/users/{id}`         | Name and profile picture                 |
| `/users/{id}/profile` | About-me info                            |
| `/users/{id}/bio`     | Biographical data                        |
| `/me`                 | Authenticated user's shortcut            |
| `/recommendations`    | List of up to 10 recommended user IDs    |
| `/connections`        | List of connected user IDs               |

---

## 🧪 Testing & Requirements

- Profile completion required before recommendations
- Minimum 5 biographical data points
- Unsearchable profiles unless recommended or connected
- Profile picture management
- Realtime chat works without polling
- Recommender logic prioritizes strong matches
- Multiple users supported (including 100 dummy users)

### Database Seeding for Testing
This project supports optional database seeding using pre-generated `.sql` seed files (e.g. `seed_10.sql`). These files will populate the database with 10 or 100 test users.
Seed files are located in:

```
/postgres/seeds/
```

All users inserted via seeding share a common password:
`password`

To run the app without any user inserted, run it with 

```
docker compose up --build
```
After that, to clear the database and seed 10 users, run 
(no need to stop the containers)

```
docker compose --profile seed run --rm --env SEED_USER_COUNT=10 seeder
```

To clear the database, and seed 100 users, run

```
docker compose --profile seed run --rm --env SEED_USER_COUNT=100 seeder
```

To just clear the database, run

```
docker compose --profile seed run --rm --env SEED_USER_COUNT= seeder
```
---

## 🧰 Tech Stack

- **Backend**: Java + Spring Boot
- **Frontend**: React
- **Database**: PostgreSQL
- **Security**: JWT, bcrypt

---

## 🚀 Getting Started

### Load Dummy Users

Use the provided loader script  to populate the DB with 10 or 100 fake users for testing and review.

---

## 🎯 Bonus Features

- Typing indicator 💬
- Online/offline indicator 🟢🔴
- Proximity-based filtering using browser location + coordinates
- Excellent UX for both mobile and desktop

---

## 📱 Responsive Design

Fully mobile-compatible interface for profile, recommendations, connections, and chat.

---

## 📦 License

MIT

---

## 👨‍💻 Created for Educational & Demonstration Purposes
