import React from 'react';
import styled from '@emotion/styled';
import PostHeadInfo, { PostHeadInfoProps } from './PostHeadInfo';

type PostHeadProps = PostHeadInfoProps & {
  headerUrl: string;
};

const PostHeadWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
`;

const BackgroundImage = styled.img`
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 400px;
  object-fit: cover;
  filter: brightness(0.25);
`;

function PostHead({ headerUrl, title, publish_date, tags }: PostHeadProps) {
  return (
    <PostHeadWrapper>
      <BackgroundImage src={headerUrl} alt="thumbnail" />
      <PostHeadInfo title={title} publish_date={publish_date} tags={tags} />
    </PostHeadWrapper>
  );
}

export default PostHead;
