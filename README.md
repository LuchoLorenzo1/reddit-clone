# Next.js Reddit Clone

This project is a Reddit clone built using Next.js 13. The app aims to replicate some of the core features of Reddit, allowing users to post, vote, and comment on various topics.

## Features

### Posts

- Post creation with a title, content, and optional image.
- Upvote or downvote of posts, with optimistic updates.
- Infinite scrolling through a feed of posts

### User Authentication and Authorization

- User login functionality with google using NextAuth.js, with JWT and CSFR tokens

### Responsive Design

- The app is responsive and works well on both desktop and mobile devices.

### Technologies Used

- Next.js
- TypeScript
- Tailwind
- Docker
- MySQL
- BackBlaze B2 Cloud storage

## Getting Started

1. Clone the repository
2. Set up environment variables by creating a `.env.local` file based on `.env.template`
3. run with docker: `docker-compose up`
4. Access the app in your browser at `http://localhost:3000`

## Acknowledgments

This project was developed for educational purposes.
