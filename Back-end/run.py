# run.py - Simple script to run the Flask application
from app import app

if __name__ == '__main__':
    # Get port from environment (Render sets this)
    port = int(os.environ.get('PORT', 5000))
    
    print("🚀 Starting Kalafo Flask Backend")
    print(f"📍 Server running at: http://0.0.0.0:{port}")
    print(f"🔗 API Health Check: http://0.0.0.0:{port}/api/health")
    print("💡 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    # Create tables when app starts
    with app.app_context():
        app.db.create_all()
        print("✅ Database tables ensured")
    
    app.run(
        debug=False,        # Set to False for production
        host='0.0.0.0',     # Bind to all interfaces (required for Render)
        port=port           # Use Render's assigned port
    )