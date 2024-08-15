import { createElement, getElementsByFolderId, getFolderById, getMemberById, getMembersByFolderId, getUserById } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { elementSchema } from "@/lib/zod"
import { ElementResponse, ElementModel, SessionResponse, UserModel, UserResponse, MemberModel, MemberResponse } from "@/types"
import { WithId } from "mongodb"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { ZodError } from "zod"

export async function POST(request: NextRequest) {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<SessionResponse>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folderId = request.nextUrl.searchParams.get("folderId")

    if (!folderId) {
      return Response.json({ error: "Missing folderId" }, { status: 400 })
    }

    const folder = await getFolderById(folderId)

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 })
    }

    const members = await getMembersByFolderId(folderId)

    if (!members.some((member) => member.userId.toString() === user._id.toString())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const {
      name,
      identifier,
      password,
      urls,
      note,
      customFields,
      idsOfMembersWhoCanEdit,
      isSensitive
    } = await elementSchema.parseAsync(body)

    idsOfMembersWhoCanEdit?.forEach((id) => {
      if (!members.some((member) => member.userId.toString() === id)) {
        return Response.json({ error: "Member not found" }, { status: 400 })
      }
    })

    const element: ElementModel = {
      folderId: folder._id,
      name,
      ...(identifier && { identifier }),
      ...(password && { password }),
      ...(urls && { urls }),
      ...(note && { note }),
      ...(customFields && { customFields }),
      ...(idsOfMembersWhoCanEdit && { idsOfMembersWhoCanEdit }),
      ...(isSensitive && { isSensitive }),
      creatorId: user._id,
      createdOn: new Date().toISOString(),
      modifierId: user._id,
      modifiedOn: new Date().toISOString(),
    }

    await createElement(element)

    return Response.json(null, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(e => e.message).join(", ")
      return Response.json({ error: errorDetails }, { status: 400 })
    }
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<SessionResponse>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folderId = request.nextUrl.searchParams.get("folderId")

    if (!folderId) {
      return Response.json({ error: "Missing folderId" }, { status: 400 })
    }

    const folder = await getFolderById(folderId)

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 })
    }

    const members = await getMembersByFolderId(folderId)

    if (!members.some((member) => member.userId.toString() === user._id.toString())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const elements = await getElementsByFolderId(folder._id.toString())

    const elementsResponse: ElementResponse[] = await Promise.all(elements.map(async (element) => {
      let membersWhoCanEdit: MemberResponse[] | undefined = undefined

      if (element.idsOfMembersWhoCanEdit) {
        membersWhoCanEdit = await Promise.all(element.idsOfMembersWhoCanEdit.map(async (id) => {
          const member = await getMemberById(id) as WithId<MemberModel>

          const user = await getUserById(member.userId.toString()) as WithId<UserModel>

          const creator = await getUserById(member.creatorId.toString()) as WithId<UserModel>

          const modifier = await getUserById(member.modifierId.toString()) as WithId<UserModel>

          return {
            id: member._id.toString(),
            user: {
              id: user._id.toString(),
              lastName: user.lastName,
              firstName: user.firstName,
              email: user.email,
              createdOn: user.createdOn,
              modifiedOn: user.modifiedOn
            },
            creator: {
              id: creator._id.toString(),
              lastName: creator.lastName,
              firstName: creator.firstName,
              email: creator.email,
              createdOn: creator.createdOn,
              modifiedOn: creator.modifiedOn
            },
            createdOn: member.createdOn,
            modifier: {
              id: modifier._id.toString(),
              lastName: modifier.lastName,
              firstName: modifier.firstName,
              email: modifier.email,
              createdOn: modifier.createdOn,
              modifiedOn: modifier.modifiedOn
            },
            modifiedOn: member.modifiedOn
          }
        }))
      }

      const creator = await getUserById(element.creatorId.toString()) as WithId<UserModel>

      const modifier = await getUserById(element.modifierId.toString()) as WithId<UserModel>

      const elementResponse: ElementResponse = {
        id: element._id.toString(),
        name: element.name,
        identifier: element.identifier,
        password: element.password,
        urls: element.urls,
        note: element.note,
        customFields: element.customFields,
        membersWhoCanEdit,
        isSensitive: element.isSensitive,
        creator: {
          id: creator._id.toString(),
          lastName: creator.lastName,
          firstName: creator.firstName,
          email: creator.email,
          createdOn: creator.createdOn,
          modifiedOn: creator.modifiedOn
        },
        createdOn: element.createdOn,
        modifier: {
          id: modifier._id.toString(),
          lastName: modifier.lastName,
          firstName: modifier.firstName,
          email: modifier.email,
          createdOn: modifier.createdOn,
          modifiedOn: modifier.modifiedOn
        },
        modifiedOn: element.modifiedOn,
      }

      return elementResponse
    }))

    return Response.json({ elements: elementsResponse }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}