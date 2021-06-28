```
virtualenv test/venv
source test/venv/bin/activate
source test/setenv.sh
python -m pip install boto3
python docker/script.py
```