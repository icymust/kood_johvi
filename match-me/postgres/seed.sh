#!/bin/bash
set -e

echo "🔁 Re-seeding database with $SEED_USER_COUNT users..."

# Grace period before checking
sleep 2

# Export password so psql/pg_isready don't prompt
export PGPASSWORD="$POSTGRES_PASSWORD"

# Wait for Postgres to be ready
until pg_isready -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" > /dev/null 2>&1; do
  echo "⏳ Waiting for Postgres at host=postgres..."
  sleep 1
done

echo "✅ Postgres is ready!"

# Clear all relevant tables
echo "🧹 Clearing existing data..."
psql -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
  TRUNCATE TABLE messages, chats, connections, user_preferences, profiles, users RESTART IDENTITY CASCADE;
EOSQL

# Seed if needed
seed_file="/seeds/seed_${SEED_USER_COUNT}.sql"
if [[ -n "$SEED_USER_COUNT" && -f "$seed_file" ]]; then
  echo "🌱 Inserting seed data from $seed_file"
  psql -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$seed_file"
else
  echo "ℹ️ No valid seed file found for SEED_USER_COUNT=$SEED_USER_COUNT — database cleared only."
fi

echo "✅ Done!"
