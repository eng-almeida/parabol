import {keyframes} from '@emotion/core'
import styled from '@emotion/styled'
import React from 'react'
import {PALETTE} from 'styles/paletteV2'
import {BezierCurve} from 'types/constEnums'
import {DECELERATE} from '../styles/animation'
import Icon from './Icon'
import PlainButton from './PlainButton/PlainButton'
import dndNoise from 'utils/dndNoise'
import CreateTaskMutation from 'mutations/CreateTaskMutation'
import {TaskStatusEnum, ThreadSourceEnum} from 'types/graphql'
import useAtmosphere from 'hooks/useAtmosphere'
import {CommentSendOrAdd_meeting} from '__generated__/CommentSendOrAdd_meeting.graphql'
import {createFragmentContainer} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'

export type CommentSubmitState = 'send' | 'add' | 'addExpanded'

const animateIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.75);
  }
	100% {
	  opacity: 1;
	  transform: scale(1);
	}
`

const SendIcon = styled(Icon)({
  animation: `${animateIn.toString()} 300ms ${DECELERATE} `,
  opacity: 1,
  color: PALETTE.TEXT_BLUE,
  fontSize: 32,
  padding: 12
})

const AddIcon = styled(Icon)<{isExpanded: boolean}>(({isExpanded}) => ({
  padding: 4,
  paddingLeft: isExpanded ? 8 : 4,
  paddingRight: isExpanded ? 8 : 4,
  transition: `all 300ms ${BezierCurve.DECELERATE} `
}))

const AddButton = styled(PlainButton)({
  alignItems: 'center',
  color: '#fff',
  backgroundColor: PALETTE.BACKGROUND_BLUE,
  borderRadius: 16,
  display: 'flex',
  height: 32,
  padding: 0,
  maxWidth: 120,
  whiteSpace: 'nowrap',
  overflow: 'hidden'
})

const ExpandedLabel = styled('div')<{isExpanded: boolean}>(({isExpanded}) => ({
  fontSize: 14,
  fontWeight: 600,
  textAlign: 'start',
  transition: `all 300ms ${BezierCurve.DECELERATE} `,
  paddingRight: isExpanded ? 8 : 0,
  width: isExpanded ? 80 : 0
}))

const ButtonGroup = styled('div')({
  borderLeft: `1px solid ${PALETTE.BORDER_GRAY} `,
  padding: 12
})

interface Props {
  commentSubmitState: CommentSubmitState
  meeting: CommentSendOrAdd_meeting
  reflectionGroupId: string
}

const CommentSendOrAdd = (props: Props) => {
  const {commentSubmitState, meeting, reflectionGroupId} = props
  const {id: meetingId, teamId} = meeting
  const atmosphere = useAtmosphere()
  if (commentSubmitState === 'send') {
    return (
      <PlainButton>
        <SendIcon>send</SendIcon>
      </PlainButton>
    )
  }
  const addTask = () => {
    const {viewerId} = atmosphere
    const newTask = {
      status: TaskStatusEnum.active,
      sortOrder: dndNoise(),
      meetingId,
      threadId: reflectionGroupId,
      threadSource: ThreadSourceEnum.REFLECTION_GROUP,
      userId: viewerId,
      teamId
    }
    CreateTaskMutation(atmosphere, {newTask}, {})
  }
  const isExpanded = commentSubmitState === 'addExpanded'
  return (
    <ButtonGroup>
      <AddButton onClick={addTask}>
        <AddIcon isExpanded={isExpanded}>playlist_add_check</AddIcon>
        <ExpandedLabel isExpanded={isExpanded}>Add a Task</ExpandedLabel>
      </AddButton>
    </ButtonGroup>
  )
}

export default createFragmentContainer(CommentSendOrAdd, {
  meeting: graphql`
    fragment CommentSendOrAdd_meeting on RetrospectiveMeeting {
      id
      teamId
    }
  `
})