import numpy as np

class FunkSVD:
    def __init__(self, n_factors=12, learning_rate=0.015, regularization=0.02, epochs=15):
        self.n_factors = n_factors
        self.lr = learning_rate
        self.reg = regularization
        self.epochs = epochs
        
        self.mu = 0.0
        self.b_u = None
        self.b_i = None
        self.P = None
        self.Q = None

    def fit(self, n_users, n_items, interactions):
        """
        Fits SVD model on user-item interactions list.
        interactions: List of tuple (user_idx, item_idx, weight_decayed)
        """
        self.mu = np.mean([w for _, _, w in interactions]) if interactions else 0.0
        self.b_u = np.zeros(n_users)
        self.b_i = np.zeros(n_items)
        
        # Initialize latent factor matrices with low variance random weights
        self.P = np.random.normal(0, 0.1, (n_users, self.n_factors))
        self.Q = np.random.normal(0, 0.1, (n_items, self.n_factors))
        
        for epoch in range(self.epochs):
            # Shuffle interaction tuples for SGD convergence
            np.random.shuffle(interactions)
            for u, i, r in interactions:
                # Predict rating
                pred = self.mu + self.b_u[u] + self.b_i[i] + np.dot(self.P[u], self.Q[i])
                err = r - pred
                
                # Update biases
                self.b_u[u] += self.lr * (err - self.reg * self.b_u[u])
                self.b_i[i] += self.lr * (err - self.reg * self.b_i[i])
                
                # Update latent factors
                p_temp = self.P[u].copy()
                self.P[u] += self.lr * (err * self.Q[i] - self.reg * self.P[u])
                self.Q[i] += self.lr * (err * p_temp - self.reg * self.Q[i])

    def predict(self, u, i):
        """Generates rating prediction for user u and item i."""
        pred = self.mu + self.b_u[u] + self.b_i[i] + np.dot(self.P[u], self.Q[i])
        return pred
