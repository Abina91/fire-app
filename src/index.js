
import { initializeApp } from "firebase/app";
import{
  getFirestore,collection,onSnapshot,addDoc,deleteDoc,doc,query,where,
  orderBy,limit
  }from 'firebase/firestore'
 

const firebaseConfig = {
  apiKey: "AIzaSyBKui17fW_rjqYlDVROcR8fVnVjL52uVSg",
  authDomain: "firstpro-ac83c.firebaseapp.com",
  projectId: "firstpro-ac83c",
  storageBucket: "firstpro-ac83c.appspot.com",
  messagingSenderId: "542264557229",
  appId: "1:542264557229:web:c2de0c68022dfcb4939024",
  measurementId: "G-P6TW2JTZ1V"
};

const app = initializeApp(firebaseConfig);
const db=getFirestore();
const colref=collection(db,'books');


//adding documents
//const q0=query(colref,where("type", "!=", "Stand-Alone"))
//const a=query(colref,where("year", ">=", 2000))
//const b=query(colref,where("year", "<=", 2000))
//const q1=query(colref,where("type","==","Series"),where('genres','array-contains','Romance'));
//const q= query(colref, where("genres", "array-contains-any",["Mystery"]));
//const q2=query(colref,where('author','in',['sibi','Ryan']));
//const q3=query(colref,where('genres','not-in',['Fiction','Mystery']));
//const  q4 = query(colref,orderBy("title","asc"));
//const q5 = query(colref,orderBy("title","desc",limit(2)));


const q = query(colref, limit(3));

const booksListElement = document.getElementById("books-list");
const averageRatingElement = document.getElementById("average-rating");
const totalBooksElement = document.getElementById("total-books");
const totalRatingsElement = document.getElementById("total-ratings");

// Listen for changes in the books collection
onSnapshot(q, (snapshot) => {
  let books = [];
  let totalRating = 0;
  let count = 0;

  booksListElement.innerHTML = ""; // Clear the list

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    books.push({ ...data, id: doc.id });
   

    // Check if the book has a rating and accumulate total rating
    if (data.avgRating) {
      totalRating += data.avgRating; // Use avgRating for total score
      count++;
      
    }
   

    // Display the book list
    const li = document.createElement("li");
    li.textContent = `Title: ${data.title}, Author: ${data.author}, Year: ${data.Year}, Type: ${data.type}, Genres: ${data.genres.join(", ")}, Rating: ${data.avgRating || 'No rating'}`;

    booksListElement.appendChild(li);
  });
  console.log(books);
 

  // Calculate and display the average rating
  const averageRating = count > 0 ? totalRating / count : 0;
  averageRatingElement.textContent = `Average Rating: ${averageRating.toFixed(2)}`;
  console.log("Average Rating:", averageRating); 

  // Display total number of books and ratings
  totalBooksElement.textContent = `Total number of books: ${snapshot.size}`;
  totalRatingsElement.textContent = `Total number of ratings: ${count}`;
});


//adding the documents
const addform=document.querySelector('.add')
addform.addEventListener('submit',(e)=>{
  e.preventDefault();

  const genres = [];
  const checkboxes = addform.querySelectorAll('input[name="genres"]:checked');
  checkboxes.forEach((checkbox) => {
    genres.push(checkbox.value);
  });

  addDoc(colref, {
    title: addform.title.value,
    author: addform.author.value,
    Year: parseInt(addform.year.value, 10), // Specify base for parseInt
    type: addform.type.value,
    genres: genres,
    avgRating: parseFloat(addform.avgRating.value) || null 
  })
  .then(()=>{
    addform.reset()
  });
});
const deleteform=document.querySelector('.delete')
  deleteform.addEventListener('submit',(e)=>{
    e.preventDefault();
    const docref=doc(db,'books',deleteform.id.value)
    deleteDoc(docref).then(()=>{
      deleteform.reset()
    });
  });
  

  

