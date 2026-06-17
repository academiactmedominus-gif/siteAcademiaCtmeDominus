import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";

// --- BLOG OPERATIONS ---

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: Date;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogRef = collection(db, "blog");
    const q = query(blogRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const posts: BlogPost[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      posts.push({
        id: docSnap.id,
        title: data.title || "",
        slug: data.slug || "",
        summary: data.summary || "",
        content: data.content || "",
        imageUrl: data.imageUrl || "/images/hero_bg.png",
        author: data.author || "Admin",
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
      });
    });
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blogRef = collection(db, "blog");
    const q = query(blogRef, where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title || "",
      slug: data.slug || "",
      summary: data.summary || "",
      content: data.content || "",
      imageUrl: data.imageUrl || "/images/hero_bg.png",
      author: data.author || "Admin",
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
    };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
}

// --- USER OPERATIONS ---

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  createdAt: Date;
  disabled?: boolean;
}

export async function getAllStudents(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "student"), orderBy("name", "asc"));
    const snap = await getDocs(q);
    const students: UserProfile[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      students.push({
        uid: docSnap.id,
        email: data.email || "",
        name: data.name || "",
        role: "student",
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
        disabled: data.disabled || false,
      });
    });
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("name", "asc"));
    const snap = await getDocs(q);
    const users: UserProfile[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      users.push({
        uid: docSnap.id,
        email: data.email || "",
        name: data.name || "",
        role: data.role || "student",
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
        disabled: data.disabled || false,
      });
    });
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function createUserProfile(uid: string, email: string, name: string, role: "student" | "teacher" | "admin"): Promise<void> {
  try {
    await setDoc(doc(db, "users", uid), {
      email,
      name,
      role,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

export async function deleteUserProfile(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "users", uid));
    // Also delete any workouts associated with this student
    const workoutsRef = collection(db, "workouts");
    const q = query(workoutsRef, where("studentId", "==", uid));
    const snap = await getDocs(q);
    snap.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "workouts", docSnap.id));
    });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
}

// --- WORKOUT OPERATIONS ---

export interface Exercise {
  name: string;
  machine: string;
  sets: number;
  reps: string;
  weight?: string;
}

export interface Workout {
  id: string;
  studentId: string;
  teacherId: string;
  title: string;
  updatedAt: Date;
  exercises: Exercise[];
}

export async function getStudentWorkouts(studentId: string): Promise<Workout[]> {
  try {
    const workoutsRef = collection(db, "workouts");
    const q = query(workoutsRef, where("studentId", "==", studentId), orderBy("updatedAt", "desc"));
    const snap = await getDocs(q);
    const workouts: Workout[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      workouts.push({
        id: docSnap.id,
        studentId: data.studentId || "",
        teacherId: data.teacherId || "",
        title: data.title || "Treino",
        updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : new Date(),
        exercises: data.exercises || [],
      });
    });
    return workouts;
  } catch (error) {
    console.error("Error fetching student workouts:", error);
    return [];
  }
}

export async function saveStudentWorkout(
  workoutId: string | null,
  studentId: string,
  teacherId: string,
  title: string,
  exercises: Exercise[]
): Promise<void> {
  try {
    if (workoutId) {
      const docRef = doc(db, "workouts", workoutId);
      await updateDoc(docRef, {
        title,
        exercises,
        updatedAt: Timestamp.now(),
      });
    } else {
      const workoutsRef = collection(db, "workouts");
      await addDoc(workoutsRef, {
        studentId,
        teacherId,
        title,
        exercises,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error saving student workout:", error);
    throw error;
  }
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "workouts", workoutId));
  } catch (error) {
    console.error("Error deleting workout:", error);
    throw error;
  }
}
