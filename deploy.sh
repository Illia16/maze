source s3.config

aws s3 sync dist s3://$bucket/ --region $region --profile personal
aws cloudfront create-invalidation --distribution-id $distributionId --paths "/*"
