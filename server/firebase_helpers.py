import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate("")

app = firebase_admin.initialize_app(cred)

db = firestore.client()

def write_to_firestore(data, public_url):
  ref = db.collection("prompts").document()
  #change to a better indexing, this is dangerous!
  ref.set({**data, "public_url": public_url, "clicked_on": 1})

def read_from_firestore(): 
  prompts_ref = db.collection("prompts")
  docs = prompts_ref.get()
  results = []
  for doc in docs:
    results.append(doc.to_dict())

   # Process each document
  # for doc in docs:
  #     print(f"Document ID: {doc.id}")
  #     print(f"Data: {doc.to_dict()}")
  #     print("")
  return results

def query_firestore(query):
    # Create a reference to the "prompts" collection
    prompts_ref = db.collection("prompts")

    # Perform the query
    query = prompts_ref.where("keywords", "array_contains", f"{query}")
    docs = query.get()

    results = []
    for doc in docs:
      results.append(doc.to_dict())

    return results
   