
import { Document } from "@/types/database";
import { extractTextFromDocument } from "@/utils/documentProcessor";
import { addItem, updateItem, getItemById, getAllItems, STORES } from "./indexedDBService";

/**
 * Uploads and processes a document
 * @param file The document file to process
 * @param contentType The type of content in the document
 * @param parentInfo Optional information about the parent entity
 * @returns Promise resolving to the processed document
 */
export async function processDocument(
  file: File,
  contentType: Document['contentType'],
  parentInfo?: { 
    type: Document['parentEntityType'], 
    id?: number 
  }
): Promise<Document> {
  // Create a file URL
  const fileUrl = URL.createObjectURL(file);
  
  // Create a new document record
  const newDocument: Document = {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileUrl,
    contentType,
    status: 'pending',
    parentEntityType: parentInfo?.type,
    parentEntityId: parentInfo?.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Save the document to the database
  const docId = await addItem<Document>(STORES.DOCUMENTS, newDocument);
  
  // Update the document with the new ID
  const document = { ...newDocument, id: docId };
  
  try {
    // Update status to processing
    await updateItem(STORES.DOCUMENTS, docId, { 
      ...document, 
      status: 'processing', 
      updatedAt: new Date().toISOString() 
    });
    
    // Process the document
    const extractedText = await extractTextFromDocument(file);
    
    // Update the document with the processed text
    const updatedDoc: Document = { 
      ...document, 
      processedText: extractedText,
      status: 'processed',
      updatedAt: new Date().toISOString()
    };
    
    // Save the updated document
    await updateItem(STORES.DOCUMENTS, docId, updatedDoc);
    
    return updatedDoc;
  } catch (error) {
    // Handle errors
    console.error('Error processing document:', error);
    
    // Update document status to error
    const errorDoc: Document = {
      ...document,
      status: 'error',
      updatedAt: new Date().toISOString()
    };
    
    await updateItem(STORES.DOCUMENTS, docId, errorDoc);
    
    return errorDoc;
  }
}

/**
 * Gets all documents
 * @returns Promise resolving to an array of documents
 */
export async function getAllDocuments(): Promise<Document[]> {
  return await getAllItems<Document>(STORES.DOCUMENTS);
}

/**
 * Gets a document by ID
 * @param id Document ID
 * @returns Promise resolving to the document
 */
export async function getDocumentById(id: number): Promise<Document | undefined> {
  return await getItemById<Document>(STORES.DOCUMENTS, id);
}

/**
 * Gets documents by parent entity
 * @param entityType The type of parent entity
 * @param entityId The ID of the parent entity
 * @returns Promise resolving to an array of documents
 */
export async function getDocumentsByParentEntity(
  entityType: Document['parentEntityType'], 
  entityId: number
): Promise<Document[]> {
  const allDocuments = await getAllDocuments();
  
  return allDocuments.filter(
    doc => doc.parentEntityType === entityType && doc.parentEntityId === entityId
  );
}

// Add the DOCUMENTS store to STORES
STORES.DOCUMENTS = 'documents';
