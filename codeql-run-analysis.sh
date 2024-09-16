#!/bin/bash

# Set environment variables for CodeQL paths and results folder
export CODEQL_SUITES_PATH="$HOME/3560/codeql-repo/javascript/ql/src/codeql-suites"
export RESULTS_FOLDER="codeql-results"
export PATH=$PATH:$HOME/3560/codeql

# Create a directory for storing results if it does not exist
mkdir -p "$RESULTS_FOLDER"

# Run CodeQL analysis with the Code Scanning suite
# Queries run by default in CodeQL code scanning on GitHub.
#codeql database analyze --search-path=./src --verbose codeqldb "$CODEQL_SUITES_PATH/javascript-code-scanning.qls" \
#--format=sarifv2.1.0 \
#--output="$RESULTS_FOLDER/javascript-code-scanning.sarif"

# Run CodeQL analysis with the Security Extended suite
# Queries of lower severity and precision than the default queries
#--format=sarif-latest \
#--output="$RESULTS_FOLDER/javascript-security-extended.sarif"

# Run CodeQL analysis with the Security and Quality suite
# Queries of lower severity and precision than the default queries
codeql database analyze codeqldb "$CODEQL_SUITES_PATH/javascript-security-and-quality.qls" \
--format=sarif-latest \
--output="$RESULTS_FOLDER/javascript-security-and-quality.sarif"

cat $RESULTS_FOLDER/javascript-security-and-quality.sarif | jq '.["$schema"] = "http://json.schemastore.org/sarif-2.1.0-rtm.1"' > $RESULTS_FOLDER/code-analysis-results.sarif