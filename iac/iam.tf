data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "execution_role" {
  name = "organization-tracker-${var.environment}"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  tags = {
    project     = local.project
    environment = var.environment
  }
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy" "lambda_basic_execution" {
  name = "AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "attach_log_permission_to_role" {
  role       = aws_iam_role.execution_role.name
  policy_arn = data.aws_iam_policy.lambda_basic_execution.arn
}
