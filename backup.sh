#!/bin/sh

num=$(date +%u)
path="$(dirname "$0")"
handle="brighterhealth"

mysqldump ${handle}_db | gzip > ~/.ploi/db_backup.sql.gz
s3cmd put ~/.ploi/db_backup.sql.gz s3://brighterbackups/${handle}/backup${num}/

s3cmd sync --delete-removed ${path}/public_html/uploads s3://brighterbackups/${handle}/backup${num}/
s3cmd sync --delete-removed ${path}/storage/logs s3://brighterbackups/${handle}/backup${num}/
s3cmd sync --delete-removed ${path}/templates s3://brighterbackups/${handle}/backup${num}/
