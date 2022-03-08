import React from 'react';

import styled from '@emotion/styled';

export type PostHeadInfoProps = {
  title: string;
  publish_date: string;
  tags: string[];
};

const PostHeadInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin: 0 auto;
  padding: 60px 0;
  color: #ffffff;

  @media (max-width: 600px) {
    width: 100%;
    padding: 40px 20px;
  }
`;

const Title = styled.div`
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: break-word;
  margin-top: auto;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 45px;
  font-weight: 800;

  @media (max-width: 600px) {
    font-size: 30px;
  }
`;

const PostData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 700;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    font-size: 15px;
    font-weight: 400;
  }
`;

function PostHeadInfo({ title, publish_date, tags }: PostHeadInfoProps) {
  return (
    <PostHeadInfoWrapper>
      <Title>{title}</Title>
      <PostData>
        <div>{tags.join(' / ')}</div>
        <div>{publish_date}</div>
      </PostData>
    </PostHeadInfoWrapper>
  );
}

export default PostHeadInfo;
