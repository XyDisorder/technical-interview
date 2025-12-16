
# Game Database API

A Node.js/Express backend application for managing a game database with support for iOS and Android games. This application provides a RESTful API to create, read, update, delete, and search games, as well as populate the database with top 100 games from App Store and Google Play Store.

⚠️ For each feature (A and B) I use an [INVEST](https://www.invensislearning.com/blog/agile-invest-model-to-write-user-stories/#:~:text=INVEST%20is%20an%20acronym%20that,-quality,%20specific%20user%20stories.) method to have little - estimable and testable feature. 
Explain below ⬇️

### FEATURE A: Search Functionality
:warning: You can read each description of PR to have more informations about technical choices.

I first do the feature with all functionnalities and Unit test
- [PR : -- add search game feature + TU --](https://github.com/XyDisorder/technical-interview/pull/1)

When my MR were validated (by me in this case) I move the search.html into the main index.htm
- [PR : ---move search.html into index.html and delete it --](https://github.com/XyDisorder/technical-interview/pull/2)

----

### FEATURE B: Populate Database with Top 100 Games
:warning: You can read each description of PR to have more informations about technical choices.

For this feature, one PR split in 2 commit to be more readable ([feature](https://github.com/XyDisorder/technical-interview/pull/3/commits/d59286d7b3545bd5568e18b9fd7bbc81ed9520c4) and [TU](https://github.com/XyDisorder/technical-interview/pull/3/commits/09243e6e82ae21ee791b30efdd56872813c180fb))
- [PR : -- Top 100 app populate](https://github.com/XyDisorder/technical-interview/pull/3)
-----

###  Fix 🔴  Quick win  for Production-Ready
1. **Centralized Error Handling** 
**Impact**: High - Security and user experience
**Effort**: Medium
**Problem**: Sequelize errors exposed directly, inconsistent handling  

2. **Input Validation** 
**Impact**: High - Security and data quality
**Effort**: Medium




# NEXT STEP : 
We can have a clear technical improvement : 
### 🔴 PRIORITY 1: Architecture Refactoring (High Impact)

#### Problem :
 All application logic is in a single `index.js` file (151 lines). Routes, business logic, and database queries are all mixed together.

#### Solution: Separate Routes/Controllers/Service

**Benefits: :cool: **
**Maintainability**: Easy to find and modify code
 **Testability**: Services can be tested independently
 **Scalability**: Easy to add new features without touching existing code
**Separation of Concerns**: Clear boundaries between layers
**Effort**: Medium (2-3 hours)
**Impact**: High - Foundation for all future improvements

#### 🟡 PRIORITY 2: Environment Variables & Configuration
**Effort**: Low 
**Impact**: Medium - Required for production deployment
**Benefits:** 
-  **Security**: Sensitive data not in code 
-  **Flexibility**: Different configs for dev/staging/prod-  
- **Best Practice**: Standard approach for Node.js apps

### 🟡 PRIORITY 3: Structured Logging
### Problem

- Using `console.log` everywhere

- No log levels

- No structured format

- Hard to debug in production

### Solution

- Install `winston` for structured logging

- Replace all `console.log` with proper logging

- Add log levels (error, warn, info, debug)

**Benefits:**

-  **Debugging**: Easy to filter and search logs

-  **Monitoring**: Can integrate with log aggregation tools

-  **Production Ready**: Essential for production debugging

**Effort**: Medium 

**Impact**: Medium - Critical for production operations

  
### 🟢 PRIORITY 4: Database Optimizations
  
### Problem
- No indexes on frequently queried fields (name, platform)

- No unique constraint on (storeId, platform)

- No pagination for GET /api/games


### Solution

1.  **Add database indexes:**
2.  **Add pagination:**

**Benefits:**

-  **Performance**: Faster queries with indexes

-  **Scalability**: Pagination prevents loading too much data

-  **Data Integrity**: Unique constraint prevents duplicates

**Effort**: Low 

**Impact**: Medium - Important for performance at scale

  

---

