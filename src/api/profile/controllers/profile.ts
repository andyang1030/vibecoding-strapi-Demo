import { factories } from '@strapi/strapi';

const PROFILE_UID = 'api::profile.profile';

export default factories.createCoreController(
  'api::profile.profile' as any,
  ({ strapi }) => ({
    async incrementLike(ctx) {
      const documentService = (strapi as any).documents?.(PROFILE_UID);

      if (documentService) {
        const profile = await documentService.findFirst({});

        if (!profile?.documentId) {
          return ctx.notFound('Profile not found');
        }

        const likes = Number(profile.likes ?? 0) + 1;
        const updatedProfile = await documentService.update({
          documentId: profile.documentId,
          data: { likes },
        });

        ctx.body = {
          data: {
            likes: updatedProfile.likes ?? likes,
          },
        };

        return;
      }

      const entityService = (strapi as any).entityService;
      const existingProfile = await entityService.findMany(PROFILE_UID, {
        limit: 1,
      });
      const profile = Array.isArray(existingProfile)
        ? existingProfile[0]
        : existingProfile;

      if (!profile?.id) {
        return ctx.notFound('Profile not found');
      }

      const likes = Number(profile.likes ?? 0) + 1;
      const updatedProfile = await entityService.update(PROFILE_UID, profile.id, {
        data: { likes },
      });

      ctx.body = {
        data: {
          likes: updatedProfile.likes ?? likes,
        },
      };
    },
  })
);
