#!/usr/bin/env sh

export NODE_ENV=development
#export API_URL=http://localhost:8081
export CYPRESS_TESTS=true

docker-compose -f ../docker-compose.yml up -d
docker-compose exec -t api npm run migrate
docker-compose exec -t api npm run seed
#docker-compose -f docker-compose.cypress.yml up $@

#npx cypress run --headless $@

docker-compose exec -i api npm run cy:run:ci $@
EXIT_CODE=$?
docker-compose down
exit $EXIT_CODE