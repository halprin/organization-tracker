resource "aws_cloudwatch_event_rule" "every_day" {
  name                = "organization-tracker-once-every-day-${var.environment}"
  description         = "Fires once every day"
  schedule_expression = "rate(1 day)"

  tags = {
    project     = local.project
    environment = var.environment
  }
}

resource "aws_cloudwatch_event_target" "notify_lambda" {
  rule      = aws_cloudwatch_event_rule.every_day.name
  target_id = "lambda"
  arn       = aws_lambda_function.lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "events.amazonaws.com"

  source_arn    = aws_cloudwatch_event_rule.every_day.arn
}
