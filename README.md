
finished(major modules):
	web:
		◦ Major module: Use a framework to build the backend.
		◦ Minor module: Use a framework or a toolkit to build the frontend.
		◦ Major module: Store the score of a tournament in the Blockchain.
	User Management: 
		◦ Major module: Standard user management, authentication, users across tournaments.
		◦ Major module: Implementing a remote authentication.
	Gameplay and user experience:
		◦ Major module: Remote players (pc)
		◦ Major module: Multiplayer (more than 2 players in the same game). 
		◦ Major module: Live chat.(pc????????)
	AI-Algo
		◦ Major module: Introduce an AI opponent.
		◦ Minor module: User and game stats dashboards
	Cybersecurity
		◦ Major module: Implement Two-Factor Authentication (2FA) and JWT.
	Graphics:
		◦ Major module: Use advanced 3D techniques.
	Server-Side Pong
		◦ Major module: Replace basic Pong with server-side Pong and implement an API.


   location /api/ {
            proxy_pass https://backend;
   
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }




docker logs logstash

curl -k https://localhost/elasticsearch/_cat/indices


console.log('Elasticsearch Node URL:', 'https://localhost/elasticsearch');


curl -k https://localhost/elasticsearch


git pull origin main
# Resolve conflicts if necessary
git add <file_with_conflict>
git commit -m "Merged latest changes from remote repository"
git push origin main


git checkout main
git pull origin main
git fetch origin cb
git merge origin/cb
# Resolve conflicts if necessary
git add <file_with_conflict>
git commit -m "Merged cb branch into main"
git push origin main