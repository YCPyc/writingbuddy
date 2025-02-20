The Common Standards Project offers an API for developers to get standards from various educational organizations.  The API is available at https://commonstandardsproject.com/developers.This guide offers a basic introduction to using the API.


Notes:
* The following steps are written in Python.  
* The output of a request has often been truncated due to the considerable length of some 


### Authorization
```python
headers = {"Authorization": ""}
```


### Get a list of all organizations
```python
>>> cur = requests.post(url="http://commonstandardsproject.com/api/v1/jurisdictions/", headers=headers)

{'id': 'DA1743190A534CB0AEC12F494BE1F8D7',
   'title': 'New York',
   'type': 'state'},
  {'id': '1BF5650D5A064C49A1AB6CDF811CBA86',
   'title': 'New York City Department of Education',
   'type': 'school'},
  {'id': 'E986B92AC48444E7997C2CBD2A0FD9E2',
   'title': 'New York City Public Schools',
   'type': 'school'}
```


### Justidiction/Organization's Standards
```python
>>> cur = requests.post(url="http://commonstandardsproject.com/api/v1/jurisdictions/DA1743190A534CB0AEC12F494BE1F8D7", headers=headers)
>>> cur.json()["data"]["standardSets"]
```


### Standard Sets
```python
# New York English Language Arts - 9 and 10
>>> cur = requests.post(url="http://commonstandardsproject.com/api/v1/standard_sets/D99D1AE64000404C8DB7CB8C0648FF6D", headers=headers)

# New York English Language Arts - 11 and 12
>>> cur = requests.post(url="http://commonstandardsproject.com/api/v1/standard_sets/DA1743190A534CB0AEC12F494BE1F8D7_D2867744_grades-11-12", headers=headers)
```


