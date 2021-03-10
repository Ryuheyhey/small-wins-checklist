import {DetailCard, TextLine, PrimaryButton, GreyButton} from "../../../components/index"
import MainLayout from "../../../layout"
import styles from "../../../styles/Home.module.css"
import Router from "next/router"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import fetch from "node-fetch"
import { useCallback } from "react"

type Post = {
  post:{
    content_1: string
    content_2: string
    content_3: string
    content_4: string
    created: string
    title: string
    _id: string
  }
}

const DailyDetail = ({post}: Post) => {
  
  console.log({post})

  const goToEdit = useCallback(() => {
    Router.push('/daily/edit/[id]', `/daily/edit/${post._id}`)
  }, [])

  const goToHome = useCallback(() => {
    Router.push({
      pathname: '/index',
    })
  }, [])

  return (
    <MainLayout title={"進歩チェックリスト"} link={"/"}>
      <div className={styles.space_sm} />
      <TextLine text={"今日進歩したこと"}/>
      <DetailCard content={post.title}/>
      <div className={styles.space_sm} />
      <TextLine text={"それをどう感じたか"}/>
      <DetailCard content={post.content_1}/>
      <div className={styles.space_sm} />
      <TextLine text={"明日も進歩を維持するには"}/>
      <DetailCard content={post.content_2}/>
      <div className={styles.space_sm} />
      <TextLine text={"今日あった障害"}/>
      <DetailCard content={post.content_3}/>
      <div className={styles.space_sm} />
      <TextLine text={"明日その障害を避けるには"}/>
      <DetailCard content={post.content_4}/>
      <div className={styles.space_md} />
      <div className={styles.center}>
      <PrimaryButton 
        label={"編集する"}
        onClick={goToEdit}
      />
      </div>
      <div className={styles.center}>
      <GreyButton 
        label={"ホームに戻る"}
        onClick={goToHome}
      />
      </div>
      <div className={styles.space_sm} />
    </MainLayout>
  )
}

export default DailyDetail

// export const getStaticPaths: GetStaticPaths = async () => {
//   const res = await fetch('http://0.0.0.0:3000/index/get')
//   const posts = await res.json()

//   const paths = posts.map(post => ({
//     params: {
//       id: post._id
//     }
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const id = params.id
  const res = await fetch(`http://0.0.0.0:3000/detail/get/${id}`)
  const post = await res.json()

  return {
    props: {
      post
    }
  }
}