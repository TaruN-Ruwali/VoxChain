
 # 🗳️ VoxChain

**Blockchain-Powered Voting Platform Built on Algorand**

VoxChain is a modern, transparent, and tamper-proof voting system that leverages blockchain technology to ensure every vote is verifiable, immutable, and secure. Built with React, Node.js, and the Algorand blockchain.

---

## 🌟 What Makes VoxChain Special?

### 1. **Immutable Vote Records**
Every vote is recorded as a transaction on the Algorand blockchain. Once cast, votes cannot be altered, deleted, or manipulated — ensuring complete election integrity.

### 2. **Real-Time Transparency**
Watch votes being recorded in real-time with live blockchain visualization. See blocks being created, transactions being confirmed, and results updating instantly via WebSocket connections.

### 3. **Verifiable by Anyone**
Each voter receives a unique transaction ID. Anyone can independently verify that their vote was recorded correctly on the blockchain — no need to trust a central authority.

### 4. **One Person, One Vote**
Cryptographic guarantees prevent double-voting. Each voter ID can only cast one vote per election, enforced both at the application and blockchain level.

### 5. **Privacy + Transparency**
Votes are publicly verifiable on the blockchain, but voter identities remain private. The system proves votes were counted without revealing who voted for whom.

### 6. **Graceful Fallback**
If blockchain connectivity is unavailable, the system automatically switches to simulation mode, ensuring voting continues uninterrupted while maintaining all security checks.

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  React Frontend │ ◄─────► │  Express Backend │ ◄─────► │ Algorand Chain  │
│   (TypeScript)  │  REST   │   (Node.js)      │  SDK    │   (TestNet)     │
└─────────────────┘  +WS    └──────────────────┘         └─────────────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │   MongoDB    │
                              │  (Database)  │
                              └──────────────┘
```

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for blazing-fast builds
- TailwindCSS for modern UI
- Recharts for data visualization
- Socket.io-client for real-time updates
- React Router for navigation

**Backend:**
- Node.js + Express
- MongoDB with Mongoose ODM
- Socket.io for WebSocket communication
- JWT authentication
- Algorand SDK for blockchain integration
- bcrypt for password hashing

**Blockchain:**
- Algorand TestNet
- Zero-fee transactions
- Sub-second finality
- Environmentally friendly (carbon-negative)

---

## ✨ Key Features

### For Voters
- 🔐 **Secure Registration** — Create account with email verification
- 🎫 **Unique Voter ID** — Auto-generated cryptographic voter identifier
- 🗳️ **Simple Ballot Interface** — Clean, intuitive voting experience
- 📜 **Vote Receipt** — Get blockchain transaction ID as proof
- ✅ **Self-Verification** — Verify your vote on the blockchain anytime
- 📊 **Live Results** — Watch election results update in real-time

### For Election Administrators
- 🔍 **Full Transparency** — Every vote is auditable on public blockchain
- 🛡️ **Tamper-Proof** — Blockchain immutability prevents vote manipulation
- 📈 **Real-Time Analytics** — Live vote counts and participation metrics
- 🔄 **Automatic Sync** — WebSocket-powered instant result updates
- 🌐 **Decentralized Trust** — No single point of failure or control

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Algorand account (optional — simulation mode available)

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd voxchain
```

**2. Backend Setup**
```bash
cd voxchain-backend/backend
npm install
```

Create `.env` file:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb://localhost:27017/voxchain

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Algorand (optional — leave empty for simulation mode)
ALGO_MNEMONIC=your 25 word mnemonic phrase here
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_PORT=443
INDEXER_SERVER=https://testnet-idx.algonode.cloud
INDEXER_PORT=443
```

Start backend:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

**3. Frontend Setup**
```bash
cd voxchain-frontend/frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📖 How It Works

### The Voting Flow

1. **Register** → User creates account with email and password
2. **Receive Voter ID** → System generates unique cryptographic identifier (e.g., `VX12345`)
3. **Authenticate** → User logs in with credentials
4. **Cast Vote** → User selects candidate and submits ballot
5. **Blockchain Recording** → Vote is submitted as Algorand transaction with encrypted note
6. **Confirmation** → User receives transaction ID as receipt
7. **Real-Time Update** → Results broadcast to all connected clients via WebSocket
8. **Verification** → Anyone can verify the transaction on Algorand blockchain

### Security Model

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Stateless token-based auth with expiration
- **Double-Vote Prevention**: Database constraints + blockchain verification
- **IP Logging**: Audit trail for fraud detection (stored securely)
- **One-Way Encryption**: Votes are hashed before blockchain submission

### Blockchain Integration

VoxChain uses Algorand's Layer-1 blockchain for vote recording:

- Each vote creates a **zero-amount payment transaction** (no ALGO transferred)
- Vote data is encoded in the transaction **note field** as JSON
- Transaction ID serves as **cryptographic proof** of vote
- Votes are confirmed in **~4 seconds** with finality
- **No gas fees** on Algorand TestNet

---

## 🎯 Use Cases

- 🏛️ **Municipal Elections** — City council, mayor, local referendums
- 🏫 **Student Government** — University and school elections
- 🏢 **Corporate Governance** — Board elections, shareholder voting
- 🤝 **Community Decisions** — HOA votes, club elections, polls
- 🌍 **DAO Governance** — Decentralized organization decision-making

---

## 🔒 Security Features

- ✅ JWT-based authentication with secure token storage
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Input validation and sanitization
- ✅ Rate limiting ready (middleware extensible)
- ✅ CORS protection
- ✅ MongoDB injection prevention
- ✅ Unique voter ID per user
- ✅ Blockchain immutability
- ✅ One vote per voter ID (enforced at DB + blockchain level)

---

## 📊 API Endpoints

### Authentication
- `POST /api/register` — Create new voter account
- `POST /api/login` — Authenticate and receive JWT
- `GET /api/me` — Get current user profile (protected)

### Voting
- `POST /api/vote` — Cast vote (protected, one-time only)
- `GET /api/results` — Get current election results
- `GET /api/verify/:txId` — Verify vote on blockchain

### Health
- `GET /api/health` — API status check

---

## 🎨 User Interface

VoxChain features a modern, accessible interface built with TailwindCSS:

- **Responsive Design** — Works on desktop, tablet, and mobile
- **Smooth Animations** — Delightful micro-interactions
- **Live Blockchain Viz** — Animated block creation on results page
- **Real-Time Charts** — Vote distribution with Recharts
- **Activity Feed** — Live transaction stream
- **Dark Accents** — Professional gradient design system

---

## 🧪 Development Mode

### Simulation Mode
Don't have an Algorand account? No problem. VoxChain automatically runs in simulation mode:

- Generates fake transaction IDs (prefixed with `SIM`)
- All voting logic works identically
- Perfect for development and testing
- Switch to real blockchain by adding `ALGO_MNEMONIC` to `.env`

### Real-Time Features
- WebSocket connection for instant result updates
- Live blockchain animation
- Activity feed with transaction notifications
- Auto-refresh on new votes

---

## 🌐 Algorand Integration

### Why Algorand?

- ⚡ **Fast** — 4-second block finality
- 💚 **Eco-Friendly** — Carbon-negative blockchain
- 💰 **Low Cost** — Minimal transaction fees
- 🔒 **Secure** — Pure proof-of-stake consensus
- 📈 **Scalable** — 6,000+ TPS capacity

### Transaction Structure

Each vote creates an Algorand transaction with:
```json
{
  "sender": "VOTING_SYSTEM_ADDRESS",
  "receiver": "VOTING_SYSTEM_ADDRESS",
  "amount": 0,
  "note": {
    "app": "VoxChain",
    "voterId": "VX12345",
    "candidate": "candidate-id",
    "ts": 1234567890
  }
}
```

---

## 📁 Project Structure

```
voxchain/
├── voxchain-backend/backend/
│   ├── config/
│   │   ├── algorand.js      # Blockchain client setup
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── voteController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── models/
│   │   ├── User.js          # Voter schema
│   │   └── Vote.js          # Vote record schema
│   ├── routes/
│   ├── server.js            # Express + Socket.io setup
│   └── package.json
│
└── voxchain-frontend/frontend/
    ├── src/
    │   ├── components/
    │   │   ├── BlockchainAnimation.tsx
    │   │   ├── CandidateCard.tsx
    │   │   ├── ChartComponent.tsx
    │   │   └── Navbar.tsx
    │   ├── pages/
    │   │   ├── HomePage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── VotePage.tsx
    │   │   ├── ResultsPage.tsx
    │   │   └── VerifyPage.tsx
    │   ├── services/
    │   │   ├── api.ts          # REST API client
    │   │   └── socket.ts       # WebSocket client
    │   ├── data/
    │   │   └── store.tsx       # Global state management
    │   └── main.tsx
    └── package.json
```

---

## 🔮 Future Enhancements

- [ ] Multi-election support
- [ ] Admin dashboard for election management
- [ ] Email notifications for vote confirmation
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Integration with government ID systems
- [ ] Support for ranked-choice voting
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG 2.1 AA)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Algorand Foundation** — For providing a fast, secure, and eco-friendly blockchain
- **MongoDB** — For flexible document storage
- **Socket.io** — For real-time communication
- **React Team** — For the amazing UI library



---

**Empowering transparent democracy through technology**


*VoxChain — Where every voice is heard, and every vote counts.*
