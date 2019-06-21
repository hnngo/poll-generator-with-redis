#!/bin/bash
# chmod +x redisLeaderboard.sh
# chmod +x redisAutoIncrScore.sh

echo "Remove old data"
redis-cli flushall

listPlayer="Nick Mike Emily Danverse Kara"
echo "Init players"
for i in $listPlayer; do
  redis-cli zadd leaderboard 0 "$i" >/dev/null
done

echo "Init leaderboard table"
redis-cli zrevrange leaderboard 0 5 withscores

while true; do
  for i in $listPlayer; do	
    number=$(($RANDOM%3))
    redis-cli ZINCRBY leaderboard $number "$i" >/dev/null
  done

  echo "_________________________"
  echo "Updated leaderboard table"
  redis-cli zrevrange leaderboard 0 5 withscores

  sleep 0.5
done
