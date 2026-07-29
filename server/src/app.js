// 1. Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '100kb' }));

// 2. API routes (MUST come before static files)
app.get('/api/health', (req, res) => res.json({ success: true, message: 'ResumeForge API is healthy.' }));
app.get('/api/debug-db', async (req, res) => {   // <-- MOVE THIS UP HERE
  try {
    const db = await pool.query('SELECT current_database()');
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    res.json({
      database: db.rows[0].current_database,
      tables: tables.rows.map(r => r.table_name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use('/api/resumes', resumeRoutes);

// 3. Static file serving (React build) - MUST come AFTER API routes
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));

// 4. Catch-all (must be LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// 5. Error handler (LAST)
app.use(errorHandler);