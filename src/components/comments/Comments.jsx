"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import Image from "next/image";

const Comments = ({ postSlug }) => {
  const status = "authenticated";

  //   const { data, mutate, isLoading } = useSWR(
  //     `http://localhost:3000/api/comments?postSlug=${postSlug}`,
  //     fetcher
  //   );

  //   const [desc, setDesc] = useState("");

  //   const handleSubmit = async () => {
  //     await fetch("/api/comments", {
  //       method: "POST",
  //       body: JSON.stringify({ desc, postSlug }),
  //     });
  //     mutate();
  //   };

  return (
    <div className={styles.container}>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <textarea placeholder="write a comment..." className={styles.input} />
          <button className={styles.button}>Send</button>
        </div>
      ) : (
        <Link href="/login">Login to write a comment</Link>
      )}
      <div className={styles.comments}>
        <div className={styles.comment}>
          <div className={styles.user}>
            <Image
              src="/p1.jpeg"
              alt=""
              width={50}
              height={50}
              className={styles.image}
            />

            <div className={styles.userInfo}>
              <span className={styles.username}>Jhon Doe</span>
              <span className={styles.date}>01.01.2023</span>
            </div>
          </div>
          <p className={styles.desc}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nemo,
            reprehenderit saepe. Illum fugiat ea, at est nobis doloribus sunt.
            Autem numquam in laborum magni odit impedit atque dicta ad
            temporibus!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comments;
