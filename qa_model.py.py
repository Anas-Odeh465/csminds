from transformers import DistilBertTokenizer, TFDistilBertForSequenceClassification
import tensorflow as tf
import json


model_path = 'trained_distilbert_model1'  
tokenizer = DistilBertTokenizer.from_pretrained(model_path)
model = TFDistilBertForSequenceClassification.from_pretrained(model_path)

with open('index_to_label.json', 'r') as f:
    index_to_label = json.load(f)

def predict_question(question):
    
    encoding = tokenizer(question, return_tensors="tf", truncation=True, padding=True, max_length=128)
    
   
    logits = model(encoding).logits
    
    
    predicted_class = tf.argmax(logits, axis=-1).numpy()[0]
    
    
    return index_to_label.get(str(predicted_class), "Unknown")

if __name__ == "__main__":
    print("Welcome! The model is ready to answer questions.")
    while True:
        question = input("Ask a question (or type 'exit' to quit): ")
        if question.lower() == 'exit':
            print("Goodbye!")
            break
        answer = predict_question(question)
        print(f"Predicted Answer: {answer}")