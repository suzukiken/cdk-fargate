FROM amazonlinux:2

RUN yum install -y python3
RUN pip3 install boto3

ADD script.py /opt/script.py

CMD [ "python3", "/opt/script.py" ]
