import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { Case3DExplorerModule } from '@/features/case3d/Case3DExplorerModule';
import { ExplorerModule } from '@/features/explorer/ExplorerModule';
import { KnobologyModule } from '@/features/knobology/KnobologyModule';
import { StationMapModule } from '@/features/stations/StationMapModule';
import { getModuleBySlug } from '@/lib/content';

export default function ModuleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const module = typeof slug === 'string' ? getModuleBySlug(slug) : undefined;
  const screenOptions = useMemo(
    () => ({
      title: module?.shortTitle ?? 'Module',
    }),
    [module?.shortTitle],
  );

  if (!module) {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <Screen
          eyebrow="Missing route"
          title="Module not found"
          subtitle="The requested module slug is not in the local content registry.">
          <SectionCard title="Fallback" subtitle="Check the route or the module content file.">
            <Text>The requested module slug is not implemented in the local content registry.</Text>
          </SectionCard>
        </Screen>
      </>
    );
  }

  if (module.id === 'knobology') {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <KnobologyModule module={module} />
      </>
    );
  }

  if (module.id === 'station-map') {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <StationMapModule module={module} />
      </>
    );
  }

  if (module.id === 'station-explorer') {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <ExplorerModule module={module} />
      </>
    );
  }

  if (module.id === 'case-3d-explorer') {
    return (
      <>
        <Stack.Screen options={screenOptions} />
        <Case3DExplorerModule module={module} />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={screenOptions} />
      <Screen
        eyebrow={module.featureFolder}
        title={module.title}
        subtitle="The module exists in the content registry, but this route does not have a dedicated implementation yet.">
        <SectionCard title="Implementation Missing" subtitle="Add a feature module and route branch for this slug.">
          <Text>This slug is registered, but no UI module is attached to the route.</Text>
        </SectionCard>
      </Screen>
    </>
  );
}
