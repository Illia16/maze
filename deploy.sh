source s3.config

aws s3 sync dist s3://$bucket/ --region $region --profile personal
aws cloudfront create-invalidation --profile personal --distribution-id $distributionId --paths "/*"
