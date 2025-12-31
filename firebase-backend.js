// firebase-backend.js
// Background Firebase sync, keeps your same UI (salesperson dropdown)

(async function () {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nowIso = () => new Date().toISOString();
  const docToObj = (doc) => ({ id: doc.id, ...doc.data() });

  async function waitForFirebase() {
    for (let i = 0; i < 80; i++) {
      if (window.fb?.db && window.fb?.auth) return;
      await sleep(100);
    }
    throw new Error("Firebase not initialized. Ensure firebase-config.js loads before firebase-backend.js");
  }

  async function ensureAnonAuth() {
    await waitForFirebase();
    const auth = window.fb.auth;
    if (auth.currentUser) return auth.currentUser;
    const cred = await auth.signInAnonymously();
    return cred.user;
  }

  const backend = {
    async init() {
      await ensureAnonAuth();
      console.log("✅ Firebase backend ready (anonymous)");
    },

    // PRODUCTS
    async getProducts() {
      await ensureAnonAuth();
      const snap = await window.fb.db.collection("products").orderBy("updatedAt", "desc").get();
      return snap.docs.map(docToObj);
    },

    async upsertProduct(product) {
      await ensureAnonAuth();
      const data = {
        ...product,
        updatedAt: nowIso(),
        createdAt: product.createdAt || nowIso(),
      };

      if (product.id) {
        const id = product.id;
        delete data.id;
        await window.fb.db.collection("products").doc(id).set(data, { merge: true });
        return { id, ...data };
      } else {
        delete data.id;
        const ref = await window.fb.db.collection("products").add(data);
        return { id: ref.id, ...data };
      }
    },

    async deleteProduct(id) {
      await ensureAnonAuth();
      await window.fb.db.collection("products").doc(id).delete();
      return true;
    },

    // SALES
    async addSale(sale) {
      await ensureAnonAuth();
      const data = { ...sale, createdAt: nowIso(), updatedAt: nowIso() };
      const ref = await window.fb.db.collection("sales").add(data);
      return { id: ref.id, ...data };
    },

    async getSales({ from, to, salesperson } = {}) {
      await ensureAnonAuth();
      let q = window.fb.db.collection("sales");
      if (from) q = q.where("saleDate", ">=", from);
      if (to) q = q.where("saleDate", "<=", to);
      if (salesperson) q = q.where("salesperson", "==", salesperson);
      const snap = await q.get();
      return snap.docs.map(docToObj);
    },

    // VISITS
    async addVisit(visit) {
      await ensureAnonAuth();
      const data = { ...visit, createdAt: nowIso(), updatedAt: nowIso() };
      const ref = await window.fb.db.collection("visits").add(data);
      return { id: ref.id, ...data };
    },

    async getVisits({ from, to, salesperson } = {}) {
      await ensureAnonAuth();
      let q = window.fb.db.collection("visits");
      if (from) q = q.where("visitDate", ">=", from);
      if (to) q = q.where("visitDate", "<=", to);
      if (salesperson) q = q.where("salesperson", "==", salesperson);
      const snap = await q.get();
      return snap.docs.map(docToObj);
    },
  };

  window.firebaseBackend = backend;
  backend.init().catch(console.error);
})();
