/* eslint-disable no-console */
import Head from 'next/head'
import React, { useRef, useState } from 'react'
import { Button } from '@material-ui/core'
import Image from 'next/image'
import { FFmpeg, createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

import styles from '../styles/Home.module.css'
import uploadFileRequest from '../domains/upload/upload.services'

// export async function mkdir() {
//   // const fileNames = fs.readdirSync(postsDirectory)
//   await fs.mkdir('temp', (err) => {
//     if (err) {
//       return console.error(err)
//     }
//     console.log('Directory created successfully!')
//     return null
//   })
// }

export default function Home() {
  const [message, setMessage] = useState<string>('')
  const video = useRef<HTMLVideoElement | null>(null)

  const ffmpeg = useRef<FFmpeg | null>(null)

  const formRef = React.useRef<HTMLFormElement | null>(null)

  const upload = async (formData: FormData) => {
    console.log('uploading')
    const response = await uploadFileRequest(formData, (event) => {
      console.log(
        'Current progress:',
        Math.round((event.loaded * 100) / event.total)
      )
    })

    formRef.current?.reset()

    console.log('response', response)
  }

  async function transcode(
    files: FileList | null,
    type?: string,
    fileName?: string
  ) {
    if (!ffmpeg.current) {
      ffmpeg.current = createFFmpeg({
        corePath: '/ffmpeg-core.js',
        log: true
      })
    }
    if (!files) return
    const { name } = files[0]
    setMessage('Loading ffmpeg-core.js')

    if (!ffmpeg.current.isLoaded()) {
      await ffmpeg.current.load()
    }

    ffmpeg.current.FS('writeFile', name, await fetchFile(files[0]))
    setMessage(`Transcoding, original type: ${type}`)

    if (type !== 'video/mp4') {
      await ffmpeg.current.run('-i', name, 'origin.mp4')
    } else {
      ffmpeg.current.FS('writeFile', 'origin.mp4', await fetchFile(files[0]))
    }
    setMessage('Complete transcoding')

    const data = ffmpeg.current.FS('readFile', 'origin.mp4')

    if (video.current) {
      video.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      )

      const formData = new FormData()

      Array.from(files).forEach((file) => {
        formData.append(fileName, file)
      })
      console.log('this is files', files)
      console.log('this is formData', formData)

      upload(formData)
      // localStorage.setItem('origin', JSON.stringify(video.current.src))
      // download video
      // const link = document.createElement('a')
      // link.href = video.current.src
      // link.setAttribute('download', 'origin.mp4')
      // document.body.appendChild(link)
      // link.click()
    }
  }
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
        <div className={styles.button}>
          <form ref={formRef}>
            <Button variant='contained' component='label'>
              Upload Video Source
              <input
                type='file'
                id='input'
                // accept='.mov,.mp4'
                onChange={
                  (e) =>
                    transcode(
                      e.target.files,
                      e.target.files[0].type,
                      e.target.name
                    )
                  // eslint-disable-next-line react/jsx-curly-newline
                }
                hidden
              />
            </Button>
          </form>
        </div>

        <div className={styles.grid}>
          <div className={styles.media}>
            <video
              ref={video}
              width={600}
              height='100%'
              id='output-video'
              controls
            >
              <track default kind='captions' srcLang='en' />
            </video>
            <h1>{message}</h1>
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
