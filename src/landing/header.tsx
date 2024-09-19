import { Link, Stack } from '@fluentui/react'
import { type FC } from 'react'
import { classes } from './styles'
import { Container } from '../comps/container'

import { MdConnectWithoutContact } from 'react-icons/md'
import IconLogo from '../shared/IconComponents/IconLogo'

const Header: FC = ({}) => {
  // When dark and light mode is implemented
  // const theme = useTheme()
  // const { setColorScheme, colorScheme } = useContext(ColorSchemeContext)

  return (
    <Stack
      className={classes.header}
      horizontal
      verticalAlign="center"
      horizontalAlign="center"
    >
      <Container>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
        >
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <Link href="/">
              <IconLogo />
            </Link>
          </Stack>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 0 }}>
            {/* For Dark Mode and Light Mode */}
            {/* <TooltipHost
              content={`Switch to ${
                colorScheme === 'dark' ? 'light' : 'dark'
              } theme`}
              delay={0}
              id={'theme-toggle-tooltip'}
              calloutProps={{ gapSpace: 0 }}
            >
              <ActionButton
                aria-describedby={'theme-toggle-tooltip'}
                iconProps={{
                  iconName: colorScheme === 'dark' ? 'Sunny' : 'ClearNight',
                }}
                styles={{
                  root: {
                    ':hover': {
                      color: 'red !important',
                    },
                  },
                  icon: {
                    color: theme.semanticColors.bodyText,
                    fontWeight: 'bold',
                    fontSize: theme.fonts.xLarge.fontSize,
                  },
                }}
                onClick={() => {
                  setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
                }}
                ariaLabel="Toggle color scheme"
              />
            </TooltipHost> */}
          </Stack>
        </Stack>
      </Container>
    </Stack>
  )
}

export default Header
