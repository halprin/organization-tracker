resource "aws_lambda_function" "lambda" {
  function_name = "organization-tracker-${var.environment}"

  filename         = data.archive_file.lambda_zip_archive.output_path
  source_code_hash = data.archive_file.lambda_zip_archive.output_base64sha256
  handler          = "external/lambda/index.handler"
  timeout          = 20
  memory_size      = 256
  runtime          = "nodejs14.x"

  environment {
    variables = {
      ORGANIZATION       = var.organization
      GITHUB_CREDENTIALS = var.github_credentials
      DOCKER_USERNAME    = var.docker_username
      DOCKER_PASSWORD    = var.docker_password
      GOOGLE_SHEET_ID    = var.google_sheet_id
      GOOGLE_CREDENTIALS = var.google_credentials
    }
  }

  role = aws_iam_role.execution_role.arn

  tags = {
    project     = local.project
    environment = var.environment
  }
}

data "archive_file" "lambda_zip_archive" {
  type        = "zip"
  source_dir = "${path.module}/../src/"
  output_path = "${path.module}/lambda.zip"
}
