# install dependencies in backend 
npm install 
echo "installing backend dependencies"

# install frontend dependencies
cd frontend
npm install 

cd ..

# install dependencies in socket
cd socket 
npm install 

# run the system
cd ..
cd frontend
npm run start
echo "frontend server is running"

cd .. 
cd socket
npm run start
echo "socket is running "

cd .. 
npm run dev 
echo "backend server is running"
