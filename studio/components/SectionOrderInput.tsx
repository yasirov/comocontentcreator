import { ArrowDownIcon, ArrowUpIcon } from "@sanity/icons";
import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { set, type ArrayOfPrimitivesInputProps } from "sanity";
import {
  HOME_SECTIONS,
  normalizeSectionOrder,
  type HomeSectionKey,
} from "../schemaTypes/shared/sections";

// The page-builder control Anton asked for: one row per block on the home
// page, with an up and a down arrow to move it. Sanity's stock array input
// would show raw strings and only offer drag-and-drop, which is fiddly on a
// trackpad and gives no hint of what "seo" or "closing" refers to.
//
// The field stores a plain list of section keys, so nothing here is needed
// to read it back on the site - see SECTION_KEYS in lib/content.ts.
// Typed with Sanity's default primitive union rather than <string>: the
// field accepts any primitive as far as the schema is concerned, and
// normalizeSectionOrder throws away anything that isn't a known key.
export function SectionOrderInput(props: ArrayOfPrimitivesInputProps) {
  const { value, onChange, readOnly } = props;
  const keys = normalizeSectionOrder(value);

  function move(from: number, to: number) {
    if (to < 0 || to >= keys.length) return;
    const next: HomeSectionKey[] = [...keys];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(set(next));
  }

  return (
    <Stack space={2}>
      {keys.map((key, index) => {
        const section = HOME_SECTIONS.find((item) => item.key === key);
        const title = section?.title ?? key;
        return (
          <Card key={key} padding={3} radius={2} shadow={1}>
            <Flex align="center" gap={2}>
              <Box flex={1}>
                <Text size={1} weight="semibold">
                  {index + 1}. {title}
                </Text>
                {section?.hint && (
                  <Box marginTop={2}>
                    <Text size={1} muted>
                      {section.hint}
                    </Text>
                  </Box>
                )}
              </Box>
              <Button
                mode="ghost"
                icon={ArrowUpIcon}
                disabled={Boolean(readOnly) || index === 0}
                onClick={() => move(index, index - 1)}
                aria-label={`Move ${title} up`}
                title={`Move ${title} up`}
              />
              <Button
                mode="ghost"
                icon={ArrowDownIcon}
                disabled={Boolean(readOnly) || index === keys.length - 1}
                onClick={() => move(index, index + 1)}
                aria-label={`Move ${title} down`}
                title={`Move ${title} down`}
              />
            </Flex>
          </Card>
        );
      })}
    </Stack>
  );
}
