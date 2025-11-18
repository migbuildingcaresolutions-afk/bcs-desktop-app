#!/bin/bash

echo "🔍 BCS Desktop App - Setup Verification"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 ${RED}(MISSING)${NC}"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ ${RED}(MISSING)${NC}"
        return 1
    fi
}

echo "📁 Checking Directory Structure..."
check_dir "backend"
check_dir "backend/routes"
check_dir "backend/middleware"
check_dir "backend/config"
check_dir "backend/scripts"
check_dir "renderer"
check_dir "renderer/src"
check_dir "renderer/src/components"
check_dir "renderer/src/views"
check_dir "renderer/src/contexts"
echo ""

echo "🔧 Checking Backend Files..."
check_file "backend/.env"
check_file "backend/server.mjs"
check_file "backend/config/database.config.js"
check_file "backend/middleware/errorHandler.js"
check_file "backend/middleware/validation.js"
check_file "backend/scripts/initDatabase.js"
echo ""

echo "🎨 Checking Frontend Components..."
check_file "renderer/src/components/Button.jsx"
check_file "renderer/src/components/Card.jsx"
check_file "renderer/src/components/Form.jsx"
check_file "renderer/src/components/Modal.jsx"
check_file "renderer/src/components/Table.jsx"
check_file "renderer/src/components/Toast.jsx"
check_file "renderer/src/components/Spinner.jsx"
check_file "renderer/src/components/Pagination.jsx"
check_file "renderer/src/components/index.js"
echo ""

echo "📄 Checking Frontend Views..."
check_file "renderer/src/views/ClientsView.jsx"
check_file "renderer/src/views/InvoicesView.jsx"
check_file "renderer/src/views/EmployeesView.jsx"
check_file "renderer/src/views/EquipmentView.jsx"
check_file "renderer/src/views/MaterialsView.jsx"
check_file "renderer/src/views/VendorsView.jsx"
check_file "renderer/src/views/WorkOrdersView.jsx"
check_file "renderer/src/views/EstimatesView.jsx"
check_file "renderer/src/views/ChangeOrdersView.jsx"
echo ""

echo "🌐 Checking State Management..."
check_file "renderer/src/contexts/AppContext.jsx"
check_file "renderer/.env"
echo ""

echo "📝 Checking Configuration..."
check_file ".gitignore"
check_file "CLAUDE.md"
check_file "ALL-GENERATED-FILES.md"
check_file "README-COMPLETE.md"
echo ""

echo "🎯 Next Steps:"
echo "1. ${YELLOW}Initialize database:${NC} node backend/scripts/initDatabase.js"
echo "2. ${YELLOW}Replace App.jsx:${NC} mv renderer/src/App.jsx renderer/src/App-old.jsx && mv renderer/src/App-new.jsx renderer/src/App.jsx"
echo "3. ${YELLOW}Start backend:${NC} cd backend && node server.mjs"
echo "4. ${YELLOW}Start frontend:${NC} cd renderer && pnpm run dev"
echo ""
echo "✅ Setup verification complete!"
