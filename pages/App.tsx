/* eslint-disable no-console */
import React, { useState } from 'react'
import Head from 'next/head'
import { Button } from '@material-ui/core'
import Image from 'next/image'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

import styles from '../styles/Home.module.css'

function App() {
  const origin = localStorage.getItem('origin')
  const getImage = JSON.parse(origin)
  // eslint-disable-next-line operator-linebreak
  // const getImage =
  //   typeof window !== 'undefined' ? localStorage.getItem('image') : null
  return (
    <div className={styles.container}>
      <Head>
        <title>zonic core</title>
        <meta name='description' content='Powered by ffmpeg' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <h1 className={styles.title}>Welcome to</h1>
          <span className={styles.logo}>
            <Image src='/zonic.svg' width={200} height={100} />
          </span>
        </div>

        <div className={styles.grid}>
          <div className={styles.media}>
            <video src={getImage} width={600} height='100%' controls>
              <source type='video/mp4' />
              <track default kind='captions' srcLang='en' />
            </video>
          </div>
          <a href='/user1' className={styles.card}>
            <h2>User 1</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href='/user2' className={styles.card}>
            <h2>User 2</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>
        </div>
      </main>
    </div>
  )
}

export default App
