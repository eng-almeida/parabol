import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import useRouter from 'hooks/useRouter'
import React from 'react'
import {createFragmentContainer} from 'react-relay'
import {PALETTE} from 'styles/paletteV2'
import getTeamIdFromPathname from 'utils/getTeamIdFromPathname'
import plural from 'utils/plural'
import {SelectMeetingDropdown_meetings} from '__generated__/SelectMeetingDropdown_meetings.graphql'
import {MenuProps} from '../hooks/useMenu'
import Menu from './Menu'
import MenuItem from './MenuItem'
import SelectMeetingDropdownItem from './SelectMeetingDropdownItem'
import Icon from 'components/Icon'

interface Props {
  menuProps: MenuProps
  meetings: SelectMeetingDropdown_meetings
}

const HeaderLabel = styled('div')({
  color: PALETTE.TEXT_GRAY,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: '16px',
  padding: '2px 16px 8px',
  userSelect: 'none'
})

const NoMeetings = styled('div')({
  alignItems: 'center',
  display: 'flex',
  fontSize: 16,
  fontWeight: 600,
  height: 56,
  justifyContent: 'center',
  padding: '0 16px',
  width: '100%'
})

const StyledIcon = styled(Icon)({
  color: PALETTE.TEXT_GRAY,
  marginRight: 16
})

const NoMeetingItem = () => (
  <NoMeetings>
    <StyledIcon>{'forum'}</StyledIcon>
    {'Start a New Meeting'}
  </NoMeetings>
)

const SelectMeetingDropdown = (props: Props) => {
  const {meetings, menuProps} = props
  const {history} = useRouter()
  const meetingCount = meetings.length
  const label = `${meetingCount} Active ${plural(meetingCount, 'Meeting')}`
  const startMeeting = () => {
    const teamId = getTeamIdFromPathname()
    history.push(`/new-meeting/${teamId}`)
  }
  return (
    <Menu ariaLabel={'Select the Meeting to enter'} {...menuProps}>
      <HeaderLabel>{label}</HeaderLabel>
      {meetingCount === 0 && <MenuItem onClick={startMeeting} label={<NoMeetingItem />} />}
      {meetings.map((meeting) => {
        const handleClick = () => {
          history.push(`/meet/${meeting.id}`)
        }
        return (
          <MenuItem
            key={meeting.id}
            label={<SelectMeetingDropdownItem meeting={meeting} />}
            onClick={handleClick}
          />
        )
      })}
    </Menu>
  )
}

export default createFragmentContainer(SelectMeetingDropdown, {
  meetings: graphql`
    fragment SelectMeetingDropdown_meetings on NewMeeting @relay(plural: true) {
      ...SelectMeetingDropdownItem_meeting
      id
    }
  `
})
